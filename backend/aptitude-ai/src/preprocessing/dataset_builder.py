"""
Dataset builder — converts raw Q/A JSON into a clean, deduplicated
training/evaluation dataset stored as JSONL.
"""
import json
import os
from typing import List, Dict


def build_qa_dataset(raw_questions: List[Dict], output_path: str) -> int:
    """
    Normalise raw question dicts into a standard schema and write as JSONL.

    Expected input dict keys (flexible):
        question | q     → question text
        correct_answer | answer | a  → correct answer
        options | choices            → list of option strings
        explanation                  → optional rationale
        topic | subject | category   → optional topic label
        type                        → "mcq" | "essay" (default: "mcq")

    Returns the number of records written.
    """
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    seen: set[str] = set()
    written = 0

    with open(output_path, "w", encoding="utf-8") as fh:
        for item in raw_questions:
            question = (
                item.get("question") or item.get("q") or ""
            ).strip()
            if not question or question in seen:
                continue
            seen.add(question)

            record = {
                "question": question,
                "correct_answer": (
                    item.get("correct_answer") or item.get("answer") or item.get("a") or ""
                ).strip(),
                "options": item.get("options") or item.get("choices") or [],
                "explanation": item.get("explanation") or "",
                "topic": item.get("topic") or item.get("subject") or item.get("category") or "General",
                "type": item.get("type") or "mcq",
            }
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")
            written += 1

    return written
