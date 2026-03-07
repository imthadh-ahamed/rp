"""
Aptitude AI — entry point.
Start the Quiz Generation API:
    python main.py
"""
import sys
import os
from pathlib import Path

# Ensure project root is on sys.path
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
        reload=True,          # disable in production
        log_level=os.getenv("LOG_LEVEL", "info").lower(),
    )
