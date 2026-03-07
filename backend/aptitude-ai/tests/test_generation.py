"""
Tests for quiz generation API.
Run: pytest tests/ -v
"""
import os
import json
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient


# ── Mock Groq before import ────────────────────────────────────────────────────
MOCK_MCQ = [
    {
        "question": "Test MCQ question?",
        "correct_answer": "Option A",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "explanation": "Option A is correct because of X.",
        "difficulty": "medium",
        "topic": "Logical Reasoning",
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
        "topic": "General Aptitude",
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


def test_topics(client):
    resp = client.get("/topics")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)


@patch("src.generation.groq_generator.generate_mcq_questions", return_value=MOCK_MCQ)
def test_generate_quiz(mock_gen, client):
    resp = client.post(
        "/generate-quiz",
        json={"topic": "Logical Reasoning", "num_questions": 1},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "question" in data[0]
    assert "correct_answer" in data[0]
    assert "options" in data[0]


@patch("src.generation.groq_generator.generate_essay_questions", return_value=MOCK_ESSAY)
def test_generate_essay(mock_gen, client):
    resp = client.post(
        "/generate-essay",
        json={"topic": "General Aptitude", "num_questions": 1},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "question" in data[0]
    assert "model_answer" in data[0]
    assert "key_points" in data[0]


def test_generate_quiz_no_api_key(client):
    prev = os.environ.pop("GROQ_API_KEY", None)
    resp = client.post(
        "/generate-quiz",
        json={"topic": "Logical Reasoning", "num_questions": 1},
    )
    assert resp.status_code == 503
    if prev:
        os.environ["GROQ_API_KEY"] = prev
