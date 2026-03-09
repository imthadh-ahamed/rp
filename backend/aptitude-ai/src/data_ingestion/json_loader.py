import json
import os
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


def load_json_datasets(dataset_dir: str) -> List[Dict[str, str]]:
    """
    Load JSON files containing questions/contexts.

    Supported JSON structures:
    - List of strings                     → each string becomes a document
    - List of dicts with 'text' field     → uses 'text' value
    - List of dicts with 'context' field  → uses 'context' value
    - List of dicts with 'question' field → builds a rich text from Q+A fields
    - Single dict                         → serialised as JSON string
    """
    if not os.path.isdir(dataset_dir):
        logger.warning(f"Dataset directory not found: {dataset_dir}")
        return []

    documents: List[Dict[str, str]] = []

    for filename in sorted(os.listdir(dataset_dir)):
        if not filename.lower().endswith(".json"):
            continue
        path = os.path.join(dataset_dir, filename)
        try:
            with open(path, "r", encoding="utf-8") as fh:
                data = json.load(fh)

            if isinstance(data, list):
                for item in data:
                    if isinstance(item, str):
                        documents.append({"source": filename, "text": item})
                    elif isinstance(item, dict):
                        if "text" in item:
                            documents.append({"source": filename, "text": item["text"]})
                        elif "context" in item:
                            documents.append({"source": filename, "text": item["context"]})
                        elif "question" in item:
                            # Reconstruct rich text from Q/A structure
                            parts = [f"Question: {item.get('question', '')}"]
                            if "correct_answer" in item:
                                parts.append(f"Answer: {item['correct_answer']}")
                            if "options" in item and isinstance(item["options"], list):
                                parts.append("Options: " + " | ".join(str(o) for o in item["options"]))
                            if "explanation" in item:
                                parts.append(f"Explanation: {item['explanation']}")
                            documents.append({"source": filename, "text": " ".join(parts)})
            elif isinstance(data, dict):
                documents.append({"source": filename, "text": json.dumps(data, ensure_ascii=False)})

            logger.info(f"Loaded JSON: {filename}")
        except Exception as exc:
            logger.error(f"Error loading {filename}: {exc}")

    logger.info(f"Total JSON documents loaded: {len(documents)}")
    return documents
