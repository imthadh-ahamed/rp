import os
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


def _extract_with_pdfplumber(path: str) -> str:
    """Primary extractor: pdfplumber preserves layout and tables well."""
    import pdfplumber
    parts: List[str] = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text = page.extract_text(x_tolerance=3, y_tolerance=3)
            if text:
                parts.append(text)
    return "\n".join(parts).strip()


def _extract_with_pypdf2(path: str) -> str:
    """Fallback extractor using PyPDF2."""
    import PyPDF2
    parts: List[str] = []
    with open(path, "rb") as fh:
        reader = PyPDF2.PdfReader(fh)
        # Try decryption with empty password (handles AES-protected PDFs)
        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except Exception:
                pass
        for page in reader.pages:
            t = page.extract_text()
            if t:
                parts.append(t)
    return " ".join(parts).strip()


def load_pdfs(pdf_dir: str) -> List[Dict[str, str]]:
    """
    Load all PDFs from a directory and extract text.
    Uses pdfplumber first (better layout), falls back to PyPDF2.
    Returns a list of dicts: {'source': filename, 'text': extracted_text}.
    """
    if not os.path.isdir(pdf_dir):
        logger.warning(f"PDF directory not found: {pdf_dir}")
        return []

    documents: List[Dict[str, str]] = []

    for filename in sorted(os.listdir(pdf_dir)):
        if not filename.lower().endswith(".pdf"):
            continue
        path = os.path.join(pdf_dir, filename)
        full_text = ""
        try:
            full_text = _extract_with_pdfplumber(path)
            if full_text:
                logger.info(f"[pdfplumber] Loaded: {filename} ({len(full_text)} chars)")
        except Exception as e1:
            logger.debug(f"pdfplumber failed for {filename}: {e1} — trying PyPDF2")
            try:
                full_text = _extract_with_pypdf2(path)
                if full_text:
                    logger.info(f"[PyPDF2] Loaded: {filename} ({len(full_text)} chars)")
            except Exception as e2:
                logger.error(f"Failed to extract {filename}: {e2}")

        if full_text:
            documents.append({"source": filename, "text": full_text})
        else:
            logger.warning(f"No text extracted from {filename} (possibly image-only PDF)")

    logger.info(f"Total PDFs loaded: {len(documents)}")
    return documents
