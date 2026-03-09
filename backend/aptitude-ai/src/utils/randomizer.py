"""
Randomization utilities for quiz assembly — shuffle option order.
"""
import random
from typing import List, Dict


def shuffle_options(question: Dict) -> Dict:
    """
    Shuffle the options list and return a modified copy.
    The correct_answer string stays unchanged (matched by value, not index).
    """
    q = dict(question)
    opts = list(q.get("options", []))
    random.shuffle(opts)
    q["options"] = opts
    return q


def shuffle_all_options(questions: List[Dict]) -> List[Dict]:
    """Shuffle options for every question in the list."""
    return [shuffle_options(q) for q in questions]
