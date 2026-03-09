"""
Pipeline: Build vector store from all source documents.
Run once (or whenever you add new PDFs/JSON data):
    cd backend/aptitude-ai
    python pipelines/build_rag_pipeline.py
"""
import sys
import logging
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.utils.helpers import setup_logging
setup_logging()

logger = logging.getLogger(__name__)


def main():
    logger.info("=== Build RAG Pipeline ===")
    from src.retrieval.build_vector_store import build_vector_store
    result = build_vector_store()
    logger.info(f"Result: {result}")


if __name__ == "__main__":
    main()
