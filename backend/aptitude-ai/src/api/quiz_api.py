"""
Aptitude AI — Quiz Generation API
FastAPI app running on port 8001.

Endpoints
---------
GET  /health       → service status + mode (rag|direct)
POST /generate     → generate structured / mini_structured / essay questions
"""
import asyncio
import logging
import os
import uuid
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

from src.utils.helpers import setup_logging

setup_logging()
logger = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parents[2]
import yaml

with open(ROOT / "config" / "config.yaml") as fh:
    _config = yaml.safe_load(fh)

# ── Vector store readiness ────────────────────────────────────────────────────
VECTOR_STORE_DIR = os.getenv("VECTOR_STORE_DIR", str(ROOT / "vector_store/faiss_index"))
INDEX_PATH = os.path.join(VECTOR_STORE_DIR, "index.faiss")


def _vector_store_ready() -> bool:
    return os.path.exists(INDEX_PATH)


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Aptitude AI Aptitude Quiz Generator",
    description="RAG-powered aptitude quiz generation with Groq (Llama 3)",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory session history ─────────────────────────────────────────────────
_session_history: Dict[str, List[str]] = defaultdict(list)
MAX_HISTORY = 200  # cap per session

# ── Question type literal ─────────────────────────────────────────────────────
QuestionTypeEnum = Literal["structured", "mini_structured", "essay"]


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    question_type: QuestionTypeEnum = Field(
        description="Type of questions to generate: structured | mini_structured | essay",
        examples=["structured"],
    )
    num_questions: int = Field(5, ge=1, le=10)
    session_id: Optional[str] = Field(
        None,
        description="Pass the session_id from a previous response to avoid repeat questions.",
    )


class StructuredQuestion(BaseModel):
    question: str
    correct_answer: str
    options: List[str]
    explanation: Optional[str] = ""
    difficulty: Optional[str] = "medium"
    type: Optional[str] = "structured"


class MiniStructuredQuestion(BaseModel):
    question: str
    correct_answer: str
    options: List[str]
    explanation: Optional[str] = ""
    difficulty: Optional[str] = "medium"
    type: Optional[str] = "mini_structured"


class EssayQuestion(BaseModel):
    question: str
    word_limit: Optional[int] = 250
    key_points: List[str]
    model_answer: str
    marking_criteria: Optional[str] = ""
    difficulty: Optional[str] = "medium"
    type: Optional[str] = "essay"


class GenerateResponse(BaseModel):
    session_id: str
    question_type: str
    questions: List[Any]  # typed by question_type at runtime


class HealthResponse(BaseModel):
    status: str
    mode: str
    vector_store_ready: bool
    groq_api_configured: bool


# ── RAG context builder ───────────────────────────────────────────────────────
# RAG query is now a fixed aptitude-domain query — no topic filter needed.
RAG_QUERY = "UOM university aptitude test questions structured mini essay reasoning"


def _build_context_sync() -> Optional[str]:
    """Synchronous FAISS retrieval — runs in thread pool."""
    try:
        from src.retrieval.retriever import get_retriever
        r = get_retriever()
        if not r.available:
            return None
        chunks = r.retrieve(RAG_QUERY)
        if not chunks:
            return None
        return "\n\n".join(c["text"] for c in chunks)
    except Exception as exc:
        logger.warning(f"Retrieval error: {exc}")
        return None


async def _build_context() -> Optional[str]:
    """Async wrapper — offloads blocking FAISS + embedding work to a thread."""
    return await asyncio.to_thread(_build_context_sync)


# ── Routes ────────────────────────────────────────────────────────────────────


@app.get("/health", response_model=HealthResponse)
async def health():
    rag_ready = _vector_store_ready()
    return HealthResponse(
        status="ok",
        mode="rag" if rag_ready else "direct",
        vector_store_ready=rag_ready,
        groq_api_configured=bool(os.getenv("GROQ_API_KEY")),
    )


@app.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    session_id = req.session_id or str(uuid.uuid4())
    logger.info(
        f"Generate request: type='{req.question_type}' n={req.num_questions} session={session_id}"
    )

    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY not configured. Add it to your .env file.",
        )

    from src.validation.duplicate_checker import DuplicateChecker

    previously_asked = _session_history[session_id][-MAX_HISTORY:]
    context = await _build_context()
    logger.info(f"Mode: {'RAG' if context else 'direct'} | history={len(previously_asked)} forbidden")

    raw_questions: List[Dict] = []

    if req.question_type == "structured":
        from src.generation.groq_generator import generate_structured_questions
        from src.utils.randomizer import shuffle_all_options

        raw = await asyncio.to_thread(
            generate_structured_questions, req.num_questions, context, previously_asked
        )
        raw = DuplicateChecker().filter_unique(raw)
        raw = shuffle_all_options(raw)

        questions = [
            StructuredQuestion(
                question=q.get("question", ""),
                correct_answer=q.get("correct_answer", ""),
                options=q.get("options", []),
                explanation=q.get("explanation", ""),
                difficulty=q.get("difficulty", "medium"),
                type="structured",
            )
            for q in raw
        ]

    elif req.question_type == "mini_structured":
        from src.generation.groq_generator import generate_mini_structured_questions
        from src.utils.randomizer import shuffle_all_options

        raw = await asyncio.to_thread(
            generate_mini_structured_questions, req.num_questions, context, previously_asked
        )
        raw = DuplicateChecker().filter_unique(raw)
        raw = shuffle_all_options(raw)

        questions = [
            MiniStructuredQuestion(
                question=q.get("question", ""),
                correct_answer=q.get("correct_answer", ""),
                options=q.get("options", []),
                explanation=q.get("explanation", ""),
                difficulty=q.get("difficulty", "medium"),
                type="mini_structured",
            )
            for q in raw
        ]

    elif req.question_type == "essay":
        from src.generation.groq_generator import generate_essay_questions
        # Essays are long — cap at 5 to stay within the 8000-token budget
        n_essays = min(req.num_questions, 5)
        raw = await asyncio.to_thread(
            generate_essay_questions, n_essays, context, previously_asked
        )
        raw = DuplicateChecker().filter_unique(raw)

        questions = [
            EssayQuestion(
                question=q.get("question", ""),
                word_limit=q.get("word_limit", 250),
                key_points=q.get("key_points", []),
                model_answer=q.get("model_answer", ""),
                marking_criteria=q.get("marking_criteria", ""),
                difficulty=q.get("difficulty", "medium"),
                type="essay",
            )
            for q in raw
        ]
    else:
        raise HTTPException(status_code=400, detail=f"Unknown question_type: {req.question_type}")

    if not questions:
        raise HTTPException(
            status_code=500,
            detail="Generation failed. Check your GROQ_API_KEY and try again.",
        )

    # Store question text in session history to prevent repeats
    for q in questions:
        _session_history[session_id].append(q.question)

    return GenerateResponse(
        session_id=session_id,
        question_type=req.question_type,
        questions=[q.model_dump() for q in questions],
    )
