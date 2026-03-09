from typing import List, Dict


def chunk_text(
    document: Dict[str, str],
    chunk_size: int = 500,
    overlap: int = 50,
) -> List[Dict[str, str]]:
    """
    Split a document's text into overlapping fixed-size chunks.
    Word-boundary aware: never cuts mid-word.
    Returns a list of chunk dicts: {'source', 'text', 'chunk_index'}.
    """
    text   = document["text"]
    source = document["source"]
    chunks: List[Dict[str, str]] = []

    start = 0
    chunk_index = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)

        # Snap to word boundary (look forward for a space / sentence terminator)
        if end < text_len and text[end] not in (" ", ".", "!", "?", "\n"):
            next_boundary = text.find(" ", end)
            if next_boundary != -1 and (next_boundary - end) < 50:
                end = next_boundary

        chunk = text[start:end].strip()
        if chunk:
            chunks.append({"source": source, "text": chunk, "chunk_index": chunk_index})
            chunk_index += 1

        next_start = end - overlap
        if next_start <= start:
            next_start = end
        start = next_start

        if start >= text_len:
            break

    return chunks


def chunk_documents(
    documents: List[Dict[str, str]],
    chunk_size: int = 500,
    overlap: int = 50,
) -> List[Dict[str, str]]:
    """Chunk a list of documents, returning all chunks flattened."""
    all_chunks: List[Dict[str, str]] = []
    for doc in documents:
        all_chunks.extend(chunk_text(doc, chunk_size=chunk_size, overlap=overlap))
    return all_chunks
