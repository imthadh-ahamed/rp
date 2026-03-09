import re


def clean_text(text: str) -> str:
    """
    Normalise raw extracted text:
    1. Collapse multiple newlines / carriage returns into a single space.
    2. Remove multiple consecutive spaces.
    3. Strip non-printable / non-ASCII characters (keep basic punctuation).
    4. Normalise common unicode smart quotes / dashes.
    """
    # Smart quotes and dashes → ASCII equivalents
    replacements = {
        "\u2018": "'", "\u2019": "'",   # smart single quotes
        "\u201c": '"', "\u201d": '"',   # smart double quotes
        "\u2013": "-", "\u2014": "-",   # en-dash, em-dash
        "\u2026": "...",                # ellipsis
    }
    for src, dst in replacements.items():
        text = text.replace(src, dst)

    # Collapse newlines / tabs
    text = re.sub(r"[\r\n\t]+", " ", text)
    # Remove non-printable ASCII chars (keep printable space–tilde range)
    text = re.sub(r"[^\x20-\x7E]+", " ", text)
    # Collapse repeated spaces
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def clean_documents(documents: list[dict]) -> list[dict]:
    """Apply clean_text to every document's 'text' field in-place (returns new list)."""
    return [{"source": d["source"], "text": clean_text(d["text"])} for d in documents]
