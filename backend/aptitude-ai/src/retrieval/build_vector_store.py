"""
Builds a FAISS vector store from source documents (PDFs and JSON datasets).

Run from the project root:
    cd backend/aptitude-ai
    python pipelines/build_rag_pipeline.py
"""
import logging
import os
import pickle
from pathlib import Path
from typing import Dict, List

logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[2]


def build_vector_store(
    pdf_dir: str | None = None,
    dataset_dir: str | None = None,
    output_dir: str | None = None,
) -> Dict:
    """
    Ingest documents, embed them with MiniLM, and persist a FAISS index.

    Returns a result dict with keys: status, num_chunks, index_path.
    """
    import yaml

    with open(ROOT / "config" / "config.yaml") as fh:
        cfg = yaml.safe_load(fh)

    pdf_dir = pdf_dir or str(ROOT / cfg["data"]["pdf_dir"])
    dataset_dir = dataset_dir or str(ROOT / cfg["data"]["dataset_dir"])
    output_dir = output_dir or str(ROOT / cfg["retrieval"]["vector_store_dir"])
    os.makedirs(output_dir, exist_ok=True)

    # ── Collect texts ──────────────────────────────────────────────────────────
    texts: List[str] = []

    # 1. PDFs via pdfplumber
    if os.path.isdir(pdf_dir):
        try:
            import pdfplumber  # type: ignore
            for pdf_file in Path(pdf_dir).rglob("*.pdf"):
                with pdfplumber.open(pdf_file) as pdf:
                    for page in pdf.pages:
                        text = page.extract_text() or ""
                        if text.strip():
                            texts.append(text.strip())
                logger.info(f"Ingested PDF: {pdf_file.name}")
        except ImportError:
            logger.warning("pdfplumber not installed — skipping PDF ingestion.")
    else:
        logger.info(f"PDF dir not found ({pdf_dir}), skipping.")

    # 2. JSON datasets
    if os.path.isdir(dataset_dir):
        import json
        for json_file in Path(dataset_dir).rglob("*.json"):
            try:
                with open(json_file, encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, list):
                    for item in data:
                        chunk = " ".join(str(v) for v in item.values() if v)
                        texts.append(chunk)
                logger.info(f"Ingested JSON: {json_file.name}")
            except Exception as exc:
                logger.warning(f"Skipping {json_file.name}: {exc}")
    else:
        logger.info(f"Dataset dir not found ({dataset_dir}), skipping.")

    if not texts:
        return {"status": "no_data", "num_chunks": 0, "index_path": None}

    # ── Chunk long texts ───────────────────────────────────────────────────────
    MAX_CHUNK = 500
    chunks: List[str] = []
    for text in texts:
        words = text.split()
        for i in range(0, len(words), MAX_CHUNK):
            chunks.append(" ".join(words[i : i + MAX_CHUNK]))

    logger.info(f"Total chunks to embed: {len(chunks)}")

    # ── Embed ──────────────────────────────────────────────────────────────────
    from sentence_transformers import SentenceTransformer  # type: ignore
    import numpy as np

    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    embeddings = model.encode(chunks, normalize_embeddings=True, show_progress_bar=True)

    # ── Build FAISS index ──────────────────────────────────────────────────────
    import faiss  # type: ignore

    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)  # inner-product → cosine similarity
    embeddings_float32 = np.asarray(embeddings, dtype=np.float32)
    index.add(np.ascontiguousarray(embeddings_float32)) # type: ignore

    index_path = os.path.join(output_dir, "index.faiss")
    texts_path = os.path.join(output_dir, "texts.pkl")

    faiss.write_index(index, index_path)
    with open(texts_path, "wb") as f:
        pickle.dump(chunks, f)

    logger.info(f"FAISS index saved → {index_path} ({index.ntotal} vectors)")
    return {"status": "ok", "num_chunks": index.ntotal, "index_path": index_path}
