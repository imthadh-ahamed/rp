"""
Randomization utilities for quiz assembly — shuffle options,
pick random contexts, vary topics within a domain.
"""
import random
from typing import List, Dict, TypeVar

T = TypeVar("T")


def shuffle_options(question: Dict) -> Dict:
    """
    Shuffle the options list in-place (returns a modified copy).
    Keeps track of the new position of the correct answer.
    """
    q = dict(question)
    opts = list(q.get("options", []))
    correct = q.get("correct_answer", "")
    random.shuffle(opts)
    q["options"] = opts
    # correct_answer stays as-is (string match), position just changes
    return q


def shuffle_all_options(questions: List[Dict]) -> List[Dict]:
    return [shuffle_options(q) for q in questions]


def random_sample(items: List[T], k: int) -> List[T]:
    """Sample k items without replacement, or all if k > len."""
    return random.sample(items, min(k, len(items)))


def pick_random_context(contexts: List[Dict]) -> Dict:
    """Pick a random retrieved context dict."""
    return random.choice(contexts) if contexts else {}
