import os
import logging
import json
import random
import textwrap
import requests
import chromadb
from chromadb.utils import embedding_functions
from pathlib import Path
from dotenv import load_dotenv

# Setup logging
logger = logging.getLogger(__name__)

# Load env vars
load_dotenv()

# Configuration
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data" / "rag_project"
CONFIG_DIR = DATA_DIR / "rag_config"
CHROMA_PERSIST_DIR = DATA_DIR / "chroma_db"

GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

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

    if not CHROMA_PERSIST_DIR.exists():
        logger.warning(f"ChromaDB directory not found: {CHROMA_PERSIST_DIR}")
        return

    # Load metadata
    metadata_path = CONFIG_DIR / "metadata.json"
    if metadata_path.exists():
        with open(metadata_path, "r") as f:
            metadata = json.load(f)
    else:
        logger.error(f"metadata.json not found at {metadata_path}")

    # Initialize Chroma
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
    except Exception as e:
        logger.error(f"Failed to initialize ChromaDB: {e}")

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

def call_groq_llm(prompt, max_tokens=1400, temperature=0.0):
    """Call Groq API for LLM generation"""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY environment variable not set")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are an A/L exam question writer."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": temperature
    }

    try:
        response = requests.post(
            GROQ_ENDPOINT,
            headers=headers,
            json=payload,
            timeout=120
        )

        if response.status_code != 200:
            logger.error(f"Groq API error {response.status_code}: {response.text}")
            raise RuntimeError(f"Groq API error: {response.status_code}")

        data = response.json()
        return data["choices"][0]["message"]["content"]
    except requests.exceptions.Timeout:
        logger.error("Groq API request timeout")
        raise RuntimeError("Request to Groq API timed out")
    except Exception as e:
        logger.error(f"Groq API call failed: {e}")
        raise

def generate_mcqs_for_stream(stream, questions_per_stream=10, top_k_context=6):
    """Generate MCQ questions using RAG and LLM"""
    is_calc_stream = CALCULATION_STREAMS.get(stream, False)

    context_chunks = retrieve_top_k_for_stream(
        stream,
        query=None,
        top_k=top_k_context
    )

    if not context_chunks:
        logger.warning(f"No context chunks found for stream: {stream}")
        raise RuntimeError(f"No content found for stream: {stream}")

    context_text = "\n\n".join([
        f"Source: {c['metadata']['source_file']} (p{c['metadata']['page']})\n{c['text']}"
        for c in context_chunks
    ])

    system_prompt = textwrap.dedent(f"""
    You are an expert Sri Lankan G.C.E. A/L examiner.

    Use ONLY the provided syllabus context.
    Do NOT invent facts outside the context.

    Generate exactly {questions_per_stream} multiple-choice questions (MCQs).

    General rules:
    - Each question must test a different syllabus concept
    - Each MCQ must have exactly 4 options (A, B, C, D)
    - Only ONE option must be correct
    - Other options must be realistic distractors
    - Difficulty: A/L standard (not trivial)

    {"Include BOTH conceptual and calculation-based questions." if is_calc_stream else "Generate ONLY conceptual (theory-based) questions."}

    {"For this subject, include approximately 40% calculation-based questions and 60% conceptual questions." if is_calc_stream else ""}

    {"For calculation-based questions:" if is_calc_stream else ""}
    {"- Use standard A/L formulas stated or implied in the syllabus" if is_calc_stream else ""}
    {"- Introduce realistic numerical values where required" if is_calc_stream else ""}
    {"- Ensure exactly one correct numerical answer" if is_calc_stream else ""}
    {"- Do NOT show calculation steps or working" if is_calc_stream else ""}

    Output STRICTLY as a JSON array in the following format:

    [
      {{
        "question": "Question text",
        "options": {{
          "A": "Option A",
          "B": "Option B",
          "C": "Option C",
          "D": "Option D"
        }},
        "correct_answer": "A",
        "question_type": "conceptual or calculation"
      }}
    ]
    """).strip()

    user_prompt = (
        f"CONTEXT:\n{context_text}\n\n"
        f"INSTRUCTION: Generate {questions_per_stream} MCQs strictly following the rules above. "
        f"Return JSON only. No explanations."
    )

    gen = call_groq_llm(
        system_prompt + "\n\n" + user_prompt,
        max_tokens=1400,
        temperature=0.0
    )

    try:
        start = gen.find("[")
        end = gen.rfind("]") + 1
        if start == -1 or end == 0:
            logger.error("No JSON array found in LLM response")
            raise ValueError("Invalid response format from LLM")
        
        mcqs = json.loads(gen[start:end])
        
        if not isinstance(mcqs, list):
            raise ValueError("Response is not a JSON array")
        
        if len(mcqs) == 0:
            raise ValueError("Empty question list returned")
            
        return mcqs
    
    except Exception as e:
        logger.error(f"Error processing MCQs: {e}")
        raise

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
