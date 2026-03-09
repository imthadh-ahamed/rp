import os
import logging
import json
import random
import textwrap
import shutil
import chromadb
from chromadb.utils import embedding_functions
from pathlib import Path
from dotenv import load_dotenv
try:
    from llm.deepseek_client import client as llm_client, config as llm_config
except ImportError:
    from deepseek_client import client as llm_client, config as llm_config

# Setup logging
logger = logging.getLogger(__name__)

# Load env vars
load_dotenv()

# Configuration
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data" / "rag_project"
CONFIG_DIR = DATA_DIR / "rag_config"
CHROMA_PERSIST_DIR = DATA_DIR / "chroma_db"

# Global vars
chroma_client = None
collection = None
metadata = None

# Calculation streams config
CALCULATION_STREAMS = {
    "biological_science": True,
    "physical_science": True,
    "commerce": True,
    "technology": True,
    "art": False
}

def init_rag_service():
    """Initialize ChromaDB and load metadata."""
    global chroma_client, collection, metadata
    
    if not CONFIG_DIR.exists():
        logger.warning(f"Config directory not found: {CONFIG_DIR}")
        return # Do not crash, but functionality will be limited

    # Load metadata
    metadata_path = CONFIG_DIR / "metadata.json"
    if metadata_path.exists():
        with open(metadata_path, "r") as f:
            metadata = json.load(f)
    else:
        logger.error(f"metadata.json not found at {metadata_path}")

    # Ensure persist directory exists
    CHROMA_PERSIST_DIR.mkdir(parents=True, exist_ok=True)

    # Initialize Chroma – retry once with a fresh DB on incompatible database
    # (pyo3_runtime.PanicException is a BaseException, not Exception)
    for attempt in range(2):
        try:
            chroma_client = chromadb.PersistentClient(
                path=str(CHROMA_PERSIST_DIR)
            )

            embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="all-MiniLM-L6-v2"
            )

            collection = chroma_client.get_or_create_collection(
                name="al_streams_collection",
                embedding_function=embedding_function
            )

            logger.info(f"✅ ChromaDB initialized with {collection.count()} documents")
            break  # success
        except BaseException as e:
            if attempt == 0:
                logger.warning(
                    f"ChromaDB failed (attempt {attempt + 1}): {e}. "
                    "Deleting incompatible database and retrying..."
                )
                try:
                    shutil.rmtree(str(CHROMA_PERSIST_DIR))
                    CHROMA_PERSIST_DIR.mkdir(parents=True, exist_ok=True)
                except Exception as cleanup_err:
                    logger.error(f"Failed to remove old ChromaDB: {cleanup_err}")
                    break
            else:
                logger.error(f"ChromaDB initialization failed after retry: {e}")

def get_collection():
    if collection is None:
        init_rag_service()
    return collection

def retrieve_top_k_for_stream(stream, query=None, top_k=6, candidate_pool=20):
    """Retrieve relevant chunks for a given stream"""
    col = get_collection()
    if not col:
        return []

    try:
        if query:
            results = col.query(
                query_texts=[query],
                n_results=candidate_pool,
                where={"stream": stream}
            )
        else:
            results = col.query(
                query_texts=[f"{stream} syllabus overview"],
                n_results=candidate_pool,
                where={"stream": stream}
            )

        items = []
        if results and results.get("documents"):
            docs = results["documents"][0]
            metas = results["metadatas"][0]

            for doc, meta in zip(docs, metas):
                items.append({
                    "text": doc,
                    "metadata": meta
                })

        if len(items) > top_k:
            items = random.sample(items, top_k)

        return items
    except Exception as e:
        logger.error(f"Error retrieving chunks for stream {stream}: {e}")
        return []

def call_llm(system_prompt, user_prompt, max_tokens=8192, temperature=0.0):
    """Call the configured LLM with separate system and user messages."""
    try:
        resp = llm_client.chat.completions.create(
            model=llm_config["model"],
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
            timeout=180.0,
        )
        if resp and resp.choices:
            choice = resp.choices[0]
            finish = getattr(choice, "finish_reason", "unknown")
            content = choice.message.content or ""
            if finish == "length":
                logger.warning(
                    f"LLM response was TRUNCATED (finish_reason=length). "
                    f"max_tokens={max_tokens}. Got {len(content)} chars."
                )
            if content.strip():
                return content.strip()
        raise RuntimeError("LLM returned an empty response")
    except RuntimeError:
        raise
    except Exception as e:
        logger.error(f"LLM call failed: {type(e).__name__}: {e}")
        raise RuntimeError(f"LLM call failed: {type(e).__name__}: {e}")

def generate_mcqs_for_stream(stream, questions_per_stream=10, top_k_context=6):
    """Generate MCQ questions using RAG + LLM (falls back to direct LLM if collection is empty)"""
    is_calc_stream = CALCULATION_STREAMS.get(stream, False)

    context_chunks = retrieve_top_k_for_stream(
        stream,
        query=None,
        top_k=top_k_context
    )

    if context_chunks:
        context_text = "SYLLABUS CONTEXT:\n\n" + "\n\n".join([
            f"Source: {c['metadata'].get('source_file','unknown')} (p{c['metadata'].get('page','?')})\n{c['text']}"
            for c in context_chunks
        ])
        context_instruction = "Use ONLY the provided syllabus context. Do NOT invent facts outside the context."
    else:
        logger.warning(
            f"No context chunks in collection for stream '{stream}'. "
            "Falling back to direct LLM generation using built-in knowledge."
        )
        stream_labels = {
            "biological_science": "Sri Lankan G.C.E. A/L Biological Science",
            "physical_science": "Sri Lankan G.C.E. A/L Physical Science (Physics, Chemistry, Combined Maths)",
            "commerce": "Sri Lankan G.C.E. A/L Commerce (Accounting, Business Studies, Economics)",
            "technology": "Sri Lankan G.C.E. A/L Technology (Engineering Technology / Bio Systems Technology)",
            "art": "Sri Lankan G.C.E. A/L Arts (Combined Arts / History / Geography / Political Science)",
        }
        subject_label = stream_labels.get(stream, f"Sri Lankan G.C.E. A/L {stream.replace('_', ' ').title()}")
        context_text = (
            f"SUBJECT: {subject_label}\n\n"
            "Use your knowledge of the official Sri Lankan G.C.E. Advanced Level curriculum "
            "to generate questions appropriate for this subject."
        )
        context_instruction = "Use your expert knowledge of the Sri Lankan G.C.E. A/L curriculum to generate authentic questions."

    calc_rules = ""
    if is_calc_stream:
        calc_rules = (
            "\n    - Include approximately 40% calculation-based and 60% conceptual questions."
            "\n    - For calculation questions: use standard A/L formulas, realistic numbers,"
            " exactly one correct numerical answer, and do NOT show working."
        )

    system_prompt = textwrap.dedent(f"""
    You are an expert Sri Lankan G.C.E. A/L examiner.

    {context_instruction}

    Generate exactly {questions_per_stream} multiple-choice questions (MCQs).

    Rules:
    - Each question must test a different syllabus concept
    - Each MCQ must have exactly 4 options (A, B, C, D)
    - Only ONE option must be correct; others must be realistic distractors
    - Difficulty: A/L standard (not trivial)
    - {"Include BOTH conceptual and calculation-based questions." if is_calc_stream else "Generate ONLY conceptual (theory-based) questions."}{calc_rules}

    CRITICAL: Return ONLY a raw JSON array. No markdown. No code fences. No explanation before or after.
    Schema: [{{"question":"...","options":{{"A":"...","B":"...","C":"...","D":"..."}},"correct_answer":"A","question_type":"conceptual"}}]
    """).strip()

    user_prompt = (
        f"{context_text}\n\n"
        f"Generate {questions_per_stream} MCQs following the rules above. "
        f"Return a raw JSON array only. No markdown. No code fences. No extra text."
    )

    gen = call_llm(system_prompt, user_prompt, max_tokens=8192, temperature=0.0)

    try:
        import re

        # Strip markdown code fences (```json ... ``` or ``` ... ```)
        clean = re.sub(r"```(?:json)?\s*", "", gen).replace("```", "").strip()

        # 1. Try direct parse first
        try:
            mcqs = json.loads(clean)
            if isinstance(mcqs, list) and len(mcqs) > 0:
                return mcqs
        except json.JSONDecodeError:
            pass

        # 2. Try extracting the array slice [start:end]
        start = clean.find("[")
        end   = clean.rfind("]") + 1

        if start != -1 and end > start:
            try:
                mcqs = json.loads(clean[start:end])
                if isinstance(mcqs, list) and len(mcqs) > 0:
                    return mcqs
            except json.JSONDecodeError:
                pass

        # 3. Truncation recovery: response cut off — salvage complete objects.
        #    Find all well-formed {...} objects and re-wrap in [].
        if start != -1:
            fragment = clean[start:]
            # Close any dangling array / object brackets so json.loads may succeed
            salvaged = []
            depth = 0
            obj_start = None
            for i, ch in enumerate(fragment):
                if ch == "{":
                    if depth == 1:
                        obj_start = i
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 1 and obj_start is not None:
                        try:
                            obj = json.loads(fragment[obj_start : i + 1])
                            salvaged.append(obj)
                        except json.JSONDecodeError:
                            pass
                        obj_start = None
                elif ch == "[" and depth == 0:
                    depth = 1

            if salvaged:
                logger.warning(
                    f"LLM response was truncated; salvaged {len(salvaged)} complete MCQ(s) "
                    f"out of {questions_per_stream} requested."
                )
                return salvaged

        logger.error(f"No JSON array found in LLM response. Raw (first 800 chars): {gen[:800]}")
        raise ValueError("Invalid response format from LLM")

    except RuntimeError:
        raise
    except Exception as e:
        logger.error(f"Error processing MCQ response: {type(e).__name__}: {e}")
        raise RuntimeError(f"Failed to parse LLM response as MCQs: {type(e).__name__}: {e}")

def get_stream_details():
    col = get_collection()
    if not col:
        return {"streams": [], "stream_details": {}}
        
    try:
        all_metadata = col.get()
        available_streams = set()
        
        if all_metadata and all_metadata.get('metadatas'):
            for meta in all_metadata['metadatas']:
                if 'stream' in meta:
                    available_streams.add(meta['stream'])
        
        if not available_streams and metadata:
            available_streams = set(metadata["streams"].keys())
            
        return {
            "streams": sorted(list(available_streams)),
            "stream_details": metadata["streams"] if metadata else {}
        }
    except Exception as e:
        logger.error(f"Error getting streams: {e}")
        raise

def get_stream_info(stream):
    col = get_collection()
    if not col:
        raise RuntimeError("Database not initialized")
        
    stream = stream.strip().lower()
    
    results = col.get(
        where={"stream": stream}
    )
    
    doc_count = len(results['ids']) if results and results.get('ids') else 0
    
    if doc_count == 0:
        return None
    
    sources = set()
    if results and results.get('metadatas'):
        for meta in results['metadatas']:
            if 'source_file' in meta:
                sources.add(meta['source_file'])
    
    return {
        "stream": stream,
        "document_count": doc_count,
        "sources": sorted(list(sources)),
        "supports_calculations": CALCULATION_STREAMS.get(stream, False)
    }
