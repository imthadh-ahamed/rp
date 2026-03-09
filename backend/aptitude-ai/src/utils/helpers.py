"""
Utility helpers for Aptitude AI.
"""
import logging
import os
from pathlib import Path


def setup_logging() -> None:
    """
    Configure root logger once.
    Level is read from the LOG_LEVEL env var (default: INFO).
    """
    level_name = os.getenv("LOG_LEVEL", "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)

    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
