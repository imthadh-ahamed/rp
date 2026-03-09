import sys
import os
from pathlib import Path

# Force UTF-8 stdout/stderr on Windows to avoid emoji UnicodeEncodeError
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import recommend, al_predictor, quiz, roadmap, predict, combined
import uvicorn

# ── Aptitude-AI integration ──────────────────────────────────────────────────
# Add aptitude-ai directory to sys.path so its internal imports work
APTITUDE_AI_DIR = Path(__file__).resolve().parents[1] / "aptitude-ai"
if str(APTITUDE_AI_DIR) not in sys.path:
    sys.path.insert(0, str(APTITUDE_AI_DIR))

from dotenv import load_dotenv
load_dotenv(APTITUDE_AI_DIR / ".env")
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Agentic Course Recommendation API",
    description="AI-powered course recommendation system using RAG and LLMs",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "*"  # For development, allow all. Restrict in production.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(recommend.router, tags=["Recommendations"])
app.include_router(al_predictor.router)
app.include_router(quiz.router)
app.include_router(roadmap.router, prefix="/roadmap", tags=["Roadmap"])
app.include_router(predict.router)
app.include_router(combined.router)

# Mount the Aptitude-AI quiz generator as a sub-application
from src.api.quiz_api import app as aptitude_ai_app  # type: ignore[import]
app.mount("/aptitude-ai", aptitude_ai_app)

@app.get("/")
async def root():
    return {"message": "Agentic Course Recommendation API is running 🚀"}

if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)