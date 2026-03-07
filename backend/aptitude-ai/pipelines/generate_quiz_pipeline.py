"""
Pipeline: Run a test quiz generation end-to-end.
    cd backend/aptitude-ai
    python pipelines/generate_quiz_pipeline.py
"""
import sys
import json
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

    # MCQ test
    from src.generation.groq_generator import generate_mcq_questions, generate_essay_questions
    from src.validation.duplicate_checker import DuplicateChecker
    from src.utils.randomizer import shuffle_all_options

    topic = "Logical Reasoning"
    logger.info(f"Generating 3 MCQ for: {topic}")
    mcq_questions = generate_mcq_questions(topic=topic, num_questions=3)
    checker = DuplicateChecker()
    unique  = checker.filter_unique(mcq_questions)
    shuffled = shuffle_all_options(unique)

    print("\n── MCQ Questions ─────────────────────────────")
    for i, q in enumerate(shuffled, 1):
        print(f"\nQ{i}: {q['question']}")
        for j, opt in enumerate(q.get("options", []), 1):
            print(f"   {j}. {opt}")
        print(f"   ✓ {q['correct_answer']}")
        print(f"   💡 {q.get('explanation', '')}")

    # Essay test
    logger.info(f"Generating 2 essay Qs for: {topic}")
    essay_questions = generate_essay_questions(topic=topic, num_questions=2)
    print("\n── Essay Questions ───────────────────────────")
    for i, q in enumerate(essay_questions, 1):
        print(f"\nQ{i}: {q['question']}")
        print(f"   Key points: {q.get('key_points', [])}")
        print(f"   Model answer: {q.get('model_answer', '')[:200]}…")


if __name__ == "__main__":
    main()
