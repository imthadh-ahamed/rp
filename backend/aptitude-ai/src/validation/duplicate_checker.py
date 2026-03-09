"""
Duplicate checker — prevents identical or near-identical questions
from appearing in the same quiz.
"""
import hashlib
import re
from typing import List, Dict, Set


def _normalise(text: str) -> str:
    """Lowercase, strip punctuation and extra spaces for comparison."""
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _fingerprint(text: str) -> str:
    return hashlib.md5(_normalise(text).encode()).hexdigest()


class DuplicateChecker:
    """Session-scoped duplicate tracker."""

    def __init__(self):
        self._seen: Set[str] = set()

    def is_duplicate(self, question_text: str) -> bool:
        fp = _fingerprint(question_text)
        return fp in self._seen

    def add(self, question_text: str):
        self._seen.add(_fingerprint(question_text))

    def filter_unique(self, questions: List[Dict]) -> List[Dict]:
        """Return only questions not seen before (and register them)."""
        unique = []
        for q in questions:
            text = q.get("question", "")
            if not self.is_duplicate(text):
                unique.append(q)
                self.add(text)
        return unique

    def reset(self):
        self._seen.clear()
