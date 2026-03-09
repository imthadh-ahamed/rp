"""
BERT QA validator — uses one or more QA pipelines to verify that a generated
answer is supported by the retrieved context.

Models used (ensemble — highest confidence wins):
  1. deepset/roberta-base-squad2  (fast, good general accuracy)
  2. bert-large-uncased-whole-word-masking-finetuned-squad  (large, high accuracy)

Lazy-loads all pipelines on first use. Degrades gracefully if
torch/transformers are not available or if context is empty.
"""
import logging
from pathlib import Path
from typing import Dict, List, Optional
import yaml

logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[2]
with open(ROOT / "config" / "config.yaml") as fh:
    config = yaml.safe_load(fh)

# Support both single model (legacy) and list of models
_cfg_models: List[str] = config.get(
    "bert_qa_models",
    [config.get("bert_qa_model", "deepset/roberta-base-squad2")],
)
BERT_MODELS: List[str] = _cfg_models if isinstance(_cfg_models, list) else [_cfg_models]

_pipelines: Optional[List] = None   # lazy-loaded list of pipelines


def _get_pipelines() -> List:
    """Load all configured BERT QA pipelines (once). Returns empty list on failure."""
    global _pipelines
    if _pipelines is not None:
        return _pipelines
    _pipelines = []
    try:
        from transformers import pipeline
        import torch
        device = 0 if torch.cuda.is_available() else -1
        for model_name in BERT_MODELS:
            try:
                logger.info(f"Loading BERT QA model '{model_name}' …")
                qa = pipeline("question-answering", model=model_name, device=device)
                _pipelines.append({"name": model_name, "pipeline": qa})
                logger.info(f"Loaded: {model_name}")
            except Exception as exc:
                logger.warning(f"Could not load '{model_name}': {exc}")
    except Exception as exc:
        logger.warning(f"BERT QA unavailable: {exc}")
    return _pipelines


def validate_answer(question: str, context: str, generated_answer: str) -> Dict:
    """
    Validate `generated_answer` against `context` using an ensemble of BERT QA
    models. The result with the highest confidence score is returned.

    Returns dict:
        is_valid    : bool
        bert_answer : str   (best BERT-extracted answer)
        confidence  : float (0-1, best score across all models)
        model_used  : str   (name of the model that gave the best result)
        skipped     : bool  (True when no pipeline is available or context empty)
    """
    if not context:
        return {"is_valid": True, "bert_answer": "", "confidence": 0.0,
                "model_used": "", "skipped": True}

    pipelines = _get_pipelines()
    if not pipelines:
        return {"is_valid": True, "bert_answer": "", "confidence": 0.0,
                "model_used": "", "skipped": True}

    best: Optional[Dict] = None
    ctx_truncated = context[:2000]

    for entry in pipelines:
        try:
            result     = entry["pipeline"](question=question, context=ctx_truncated)
            confidence = float(result["score"])
            if best is None or confidence > best["confidence"]:
                best = {
                    "bert_answer": result["answer"],
                    "confidence":  confidence,
                    "model_used":  entry["name"],
                }
        except Exception as exc:
            logger.warning(f"BERT validation error ({entry['name']}): {exc}")

    if best is None:
        return {"is_valid": True, "bert_answer": "", "confidence": 0.0,
                "model_used": "", "skipped": True}

    gen_lower  = generated_answer.lower()
    bert_lower = best["bert_answer"].lower()
    is_valid   = (
        (gen_lower in bert_lower)
        or (bert_lower in gen_lower)
        or best["confidence"] > 0.4
    )

    return {
        "is_valid":    is_valid,
        "bert_answer": best["bert_answer"],
        "confidence":  round(best["confidence"], 4),
        "model_used":  best["model_used"],
        "skipped":     False,
    }
