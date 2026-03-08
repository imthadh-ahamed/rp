"""
Tests for quiz generation API.
Run: pytest tests/ -v
"""
import os
import json
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient


# ── Mock data aligned with new 3-type API ─────────────────────────────────────
MOCK_STRUCTURED = [
    {
        "question": "Test structured question?",
        "correct_answer": "Option A",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "explanation": "Option A is correct because of X.",
        "difficulty": "medium",
        "type": "structured",
    }
]

MOCK_MINI_STRUCTURED = [
    {
        "question": "Test mini question?",
        "correct_answer": "Option A",
        "options": ["Option A", "Option B"],
        "explanation": "Short reasoning.",
        "difficulty": "easy",
        "type": "mini_structured",
    }
]

MOCK_ESSAY = [
    {
        "question": "Write an essay on X.",
        "word_limit": 250,
        "key_points": ["Point 1", "Point 2", "Point 3"],
        "model_answer": "A detailed model answer about X.",
        "marking_criteria": "Award marks for clarity and depth.",
        "difficulty": "medium",
        "type": "essay",
    }
]


@pytest.fixture
def client():
    os.environ["GROQ_API_KEY"] = "test-key-xyz"
    from src.api.quiz_api import app
    return TestClient(app)


def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert "mode" in data
    assert "vector_store_ready" in data


@patch("src.generation.groq_generator.generate_structured_questions", return_value=MOCK_STRUCTURED)
def test_generate_structured(mock_gen, client):
    resp = client.post(
        "/generate",
        json={"question_type": "structured", "num_questions": 1},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "session_id" in data
    assert data["question_type"] == "structured"
    assert isinstance(data["questions"], list)
    assert len(data["questions"]) >= 1
    q = data["questions"][0]
    assert "question" in q
    assert "correct_answer" in q
    assert "options" in q


@patch("src.generation.groq_generator.generate_mini_structured_questions", return_value=MOCK_MINI_STRUCTURED)
def test_generate_mini_structured(mock_gen, client):
    resp = client.post(
        "/generate",
        json={"question_type": "mini_structured", "num_questions": 1},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["question_type"] == "mini_structured"
    assert isinstance(data["questions"], list)
    assert len(data["questions"]) >= 1
    q = data["questions"][0]
    assert "question" in q
    assert "options" in q


@patch("src.generation.groq_generator.generate_essay_questions", return_value=MOCK_ESSAY)
def test_generate_essay(mock_gen, client):
    resp = client.post(
        "/generate",
        json={"question_type": "essay", "num_questions": 1},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["question_type"] == "essay"
    assert isinstance(data["questions"], list)
    assert len(data["questions"]) >= 1
    q = data["questions"][0]
    assert "question" in q
    assert "model_answer" in q
    assert "key_points" in q


def test_generate_invalid_type(client):
    resp = client.post(
        "/generate",
        json={"question_type": "invalid_type", "num_questions": 1},
    )
    assert resp.status_code == 422  # Pydantic validation error


def test_generate_no_api_key(client):
    prev = os.environ.pop("GROQ_API_KEY", None)
    resp = client.post(
        "/generate",
        json={"question_type": "structured", "num_questions": 1},
    )
    assert resp.status_code == 503
    if prev:
        os.environ["GROQ_API_KEY"] = prev
