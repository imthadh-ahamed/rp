"""
Aptitude AI — entry point.
Start the Quiz Generation API standalone:
    cd backend/aptitude-ai
    python main.py

Runs on port 8001 by default (set PORT env var to override).
The quiz endpoints are also available via the main API at /aptitude-ai/
when running: cd backend && uvicorn api.main:app --port 8000
"""
import sys
import os
from pathlib import Path

# Ensure aptitude-ai root is on sys.path
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv
load_dotenv(ROOT / ".env")

from src.utils.helpers import setup_logging
setup_logging()

import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(
        "src.api.quiz_api:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level=os.getenv("LOG_LEVEL", "info").lower(),
    )
