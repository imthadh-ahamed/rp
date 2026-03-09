"""
FAISS retriever for Aptitude AI.

Returns an object with:
    retriever.available  → bool  (False if the index hasn't been built yet)
    retriever.retrieve(query, top_k) → list[dict]
"""
import logging
import os
from pathlib import Path
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[2]
_DEFAULT_INDEX_DIR = str(ROOT / "vector_store" / "faiss_index")


class _Retriever:
    def __init__(self) -> None:
        self._index = None
        self._texts: List[str] = []
        self._embed_model = None
        index_dir = os.getenv("VECTOR_STORE_DIR", _DEFAULT_INDEX_DIR)
        self.index_path = os.path.join(index_dir, "index.faiss")
        self.texts_path = os.path.join(index_dir, "texts.pkl")
        self.available = os.path.exists(self.index_path)
        if self.available:
            self._load()

    def _load(self) -> None:
        try:
            import faiss  # type: ignore
            import pickle

            self._index = faiss.read_index(self.index_path)
            if os.path.exists(self.texts_path):
                with open(self.texts_path, "rb") as f:
                    self._texts = pickle.load(f)
            self._embed_model = self._load_embed_model()
            logger.info(f"FAISS index loaded ({self._index.ntotal} vectors).")
        except Exception as exc:
            logger.warning(f"Failed to load FAISS index: {exc}")
            self.available = False

    def _load_embed_model(self):
        try:
            from sentence_transformers import SentenceTransformer  # type: ignore
            return SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        except Exception as exc:
            logger.warning(f"Could not load embedding model: {exc}")
            return None

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict]:
        if not self.available or self._index is None or self._embed_model is None:
            return []
        try:
            import numpy as np
            vec = self._embed_model.encode([query], normalize_embeddings=True)
            _, indices = self._index.search(np.array(vec, dtype="float32"), top_k)
            results = []
            for idx in indices[0]:
                if 0 <= idx < len(self._texts):
                    results.append({"text": self._texts[idx]})
            return results
        except Exception as exc:
            logger.warning(f"Retrieval error: {exc}")
            return []


_retriever: Optional[_Retriever] = None


def get_retriever() -> _Retriever:
    """Return a cached singleton retriever."""
    global _retriever
    if _retriever is None:
        _retriever = _Retriever()
    return _retriever
