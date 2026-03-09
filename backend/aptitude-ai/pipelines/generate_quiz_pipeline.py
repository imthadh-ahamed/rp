"""
Pipeline: Run a test quiz generation end-to-end.
    cd backend/aptitude-ai
    python pipelines/generate_quiz_pipeline.py
"""
import sys
import logging
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.utils.helpers import setup_logging
setup_logging()

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

logger = logging.getLogger(__name__)


def main():
    logger.info("=== Generate Quiz Pipeline ===")

    from src.generation.groq_generator import (
        generate_structured_questions,
        generate_mini_structured_questions,
        generate_essay_questions,
    )
    from src.validation.duplicate_checker import DuplicateChecker
    from src.utils.randomizer import shuffle_all_options

    # Structured questions test
    logger.info("Generating 3 structured questions")
    structured = generate_structured_questions(num_questions=3)
    checker  = DuplicateChecker()
    unique   = checker.filter_unique(structured)
    shuffled = shuffle_all_options(unique)

    print("\n── Structured Questions ──────────────────────")
    for i, q in enumerate(shuffled, 1):
        print(f"\nQ{i}: {q['question']}")
        for j, opt in enumerate(q.get("options", []), 1):
            print(f"   {j}. {opt}")
        print(f"   [ANSWER] {q['correct_answer']}")
        print(f"   [EXPLAIN] {q.get('explanation', '')}")

    # Mini-structured questions test
    logger.info("Generating 2 mini-structured questions")
    mini = generate_mini_structured_questions(num_questions=2)
    print("\n── Mini-Structured Questions ─────────────────")
    for i, q in enumerate(mini, 1):
        print(f"\nQ{i}: {q['question']}")
        for j, opt in enumerate(q.get("options", []), 1):
            print(f"   {j}. {opt}")
        print(f"   [ANSWER] {q['correct_answer']}")

    # Essay questions test
    logger.info("Generating 2 essay questions")
    essay_questions = generate_essay_questions(num_questions=2)
    print("\n── Essay Questions ───────────────────────────")
    for i, q in enumerate(essay_questions, 1):
        print(f"\nQ{i}: {q['question']}")
        print(f"   Key points: {q.get('key_points', [])}")
        print(f"   Model answer: {q.get('model_answer', '')[:200]}...")


if __name__ == "__main__":
    main()
