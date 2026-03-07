"""
Groq LLM generator â€” generates structured, mini-structured, and essay questions.
Uses groq Python client (Llama 3-8B) for fast, free inference.

Question types
--------------
  structured      : full MCQ-style â€” 4 options, one correct, with explanation
  mini_structured : shorter aptitude check â€” 2â€“4 options, simpler scenario
  essay           : open-ended written-response question with model answer

Modes
-----
RAG mode  : context retrieved from FAISS (real UOM past papers) â†’
            questions grounded in source material, never verbatim copies
Direct mode: no RAG available â†’ high-quality type-prompted generation

Uniqueness guarantees
---------------------
- `previously_asked` list injected into every prompt so Groq explicitly
  knows to avoid those questions.
- Random seed token in each call forces different generation paths.
- Numeric values in questions are explicitly requested to be randomised.
- Temperature raised to 0.95 for maximum variety.
"""
import json
import logging
import os
import random
import string
from pathlib import Path
from typing import List, Dict, Optional

import yaml
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[2]
with open(ROOT / "config" / "config.yaml") as fh:
    config = yaml.safe_load(fh)

MODEL_ID    = config.get("groq_model_id", "llama3-8b-8192")
MAX_TOKENS  = config.get("generation", {}).get("max_tokens", 2048)
TEMPERATURE = 0.95


def _get_client():
    """Lazy-init Groq client â€” raises if GROQ_API_KEY not set."""
    from groq import Groq
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "GROQ_API_KEY not set. Add it to your .env file. "
            "Get a free key at https://console.groq.com"
        )
    return Groq(api_key=api_key)


def _parse_json_array(text: str) -> list:
    """Robustly extract the first JSON array from generated text."""
    start = text.find("[")
    if start != -1:
        depth, end = 0, -1
        for i, ch in enumerate(text[start:], start):
            if ch == "[":
                depth += 1
            elif ch == "]":
                depth -= 1
                if depth == 0:
                    end = i
                    break
        if end != -1:
            try:
                return json.loads(text[start : end + 1])
            except json.JSONDecodeError:
                pass
    try:
        parsed = json.loads(text.strip())
        return parsed if isinstance(parsed, list) else [parsed]
    except Exception:
        return []


def _seed_token() -> str:
    """Random 8-char token to force a unique generation path each call."""
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=8))


def _forbidden_block(previously_asked: List[str]) -> str:
    """Build the 'DO NOT generate these' section of the prompt."""
    if not previously_asked:
        return ""
    lines = "\n".join(f"  - {q}" for q in previously_asked[:30])
    return (
        "CRITICAL â€” DO NOT generate any of the following questions or questions\n"
        "that are semantically similar to them. Use completely different scenarios,\n"
        f"values, and wording:\n{lines}\n"
    )


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  Structured question generator  (full MCQ â€” 4 options, one correct)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

STRUCTURED_SYSTEM = """\
You are an expert aptitude test designer for University of Moratuwa (UOM) Sri Lanka entrance exams.
You create STRUCTURED questions â€” each has exactly 4 options where exactly one is correct.

ABSOLUTE RULES:
1. NEVER reproduce any source question verbatim â€” always create entirely new scenarios.
2. For any question involving numbers: ALWAYS use different numeric values. Randomise all numbers.
3. Every option set must have exactly 4 options; exactly one is correct.
4. Distractors must be plausible (common mistakes, off-by-one, wrong formula, etc.).
5. Vary difficulty: ~30% easy, ~50% medium, ~20% hard.
6. Return ONLY a valid JSON array â€” no markdown, no preamble, no trailing text."""

STRUCTURED_PROMPT_RAG = """\
[seed:{seed}]

You have access to real UOM aptitude test content below. Study it deeply â€” understand
the question styles, difficulty, and reasoning required. Then generate {n} BRAND NEW
structured questions INSPIRED BY but NOT COPIED FROM this content.

For every numerical question: change ALL numbers to fresh random values.
Each question must test a DIFFERENT concept or reasoning skill.

{forbidden}

SOURCE CONTENT (study and be inspired, do NOT copy):
---
{context}
---

Generate EXACTLY {n} structured questions as a JSON array:
[
  {{
    "question": "...",
    "correct_answer": "exact string matching one option",
    "options": ["option A", "option B", "option C", "option D"],
    "explanation": "Step-by-step reasoning showing why the correct answer is right.",
    "difficulty": "easy|medium|hard",
    "type": "structured"
  }}
]"""

STRUCTURED_PROMPT_DIRECT = """\
[seed:{seed}]

Generate {n} high-quality structured aptitude questions for UOM Sri Lanka entrance exams.
Cover a broad range of reasoning skills: spatial, logical, numerical, verbal, and abstract.

Requirements:
- Each question tests a DIFFERENT sub-skill or concept.
- Mix scenario-based, calculation, and logic questions.
- For numerical questions: use varied, realistic numbers (not round numbers like 10, 100).
- Correct answer must appear exactly in the options list.

{forbidden}

Format as a JSON array:
[
  {{
    "question": "...",
    "correct_answer": "exact string matching one option",
    "options": ["option A", "option B", "option C", "option D"],
    "explanation": "Step-by-step reasoning showing why this is correct.",
    "difficulty": "easy|medium|hard",
    "type": "structured"
  }}
]"""


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  Mini-structured question generator  (shorter, 2â€“4 options)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

MINI_STRUCTURED_SYSTEM = """\
You are an expert aptitude test designer for UOM Sri Lanka entrance exams.
You create MINI STRUCTURED questions â€” brief, focused aptitude checks with 2â€“4 options.
These test quick reasoning, pattern recognition, and simple logic.

ABSOLUTE RULES:
1. Questions must be SHORT â€” one sentence, clear and unambiguous.
2. Each question has 2, 3, or 4 options; exactly one is correct.
3. NEVER reproduce any source question verbatim.
4. Vary difficulty: ~40% easy, ~40% medium, ~20% hard.
5. Return ONLY a valid JSON array â€” no markdown, no preamble."""

MINI_STRUCTURED_PROMPT_RAG = """\
[seed:{seed}]

Study the following real UOM aptitude test content. Learn the style and difficulty.
Then generate {n} BRAND NEW mini structured questions inspired by â€” but NEVER copied from â€” it.

{forbidden}

SOURCE CONTENT:
---
{context}
---

Generate EXACTLY {n} mini structured questions as a JSON array:
[
  {{
    "question": "...",
    "correct_answer": "exact string matching one option",
    "options": ["option A", "option B", "option C"],
    "explanation": "Brief explanation of why the answer is correct.",
    "difficulty": "easy|medium|hard",
    "type": "mini_structured"
  }}
]"""

MINI_STRUCTURED_PROMPT_DIRECT = """\
[seed:{seed}]

Generate {n} mini structured aptitude questions for UOM Sri Lanka entrance exams.
Each must be a SHORT, focused question with 2â€“4 options that tests quick reasoning.

Topics to cover (vary them): number sequences, odd-one-out, simple analogies,
basic spatial reasoning, quick logical deductions, pattern completion.

{forbidden}

Format as a JSON array:
[
  {{
    "question": "...",
    "correct_answer": "exact string matching one option",
    "options": ["option A", "option B", "option C"],
    "explanation": "Brief explanation of the correct answer.",
    "difficulty": "easy|medium|hard",
    "type": "mini_structured"
  }}
]"""


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  Essay question generator
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

ESSAY_SYSTEM = """\
You are an expert aptitude exam designer for UOM Sri Lanka entrance exams.
You create thought-provoking essay questions that assess reasoning,
analysis, creativity, and written communication skills.

ABSOLUTE RULES:
1. NEVER reproduce source questions verbatim â€” always create new scenarios.
2. Questions must be open-ended and require genuine reasoning (not just recall).
3. Provide a thorough model answer and 4â€“6 key marking points.
4. Return ONLY a valid JSON array â€” no markdown, no preamble."""

ESSAY_PROMPT_RAG = """\
[seed:{seed}]

Study the following real UOM aptitude exam content carefully. Understand the
themes, depth of reasoning expected, and writing style required. Then generate
{n} BRAND NEW essay questions inspired by â€” but not copied from â€” this material.

{forbidden}

SOURCE CONTENT (study and be inspired, do NOT copy):
---
{context}
---

Generate EXACTLY {n} essay questions as a JSON array:
[
  {{
    "question": "...",
    "word_limit": 250,
    "key_points": ["marking point 1", "marking point 2", "marking point 3", "marking point 4"],
    "model_answer": "A comprehensive 200-250 word model answer...",
    "marking_criteria": "Description of how marks are distributed across key points.",
    "difficulty": "medium|hard",
    "type": "essay"
  }}
]"""

ESSAY_PROMPT_DIRECT = """\
[seed:{seed}]

Generate {n} essay aptitude questions for UOM Sri Lanka entrance exams.
These should assess reasoning, analysis, creativity, and communication skills
across topics such as architecture, design, environment, society, and problem-solving.

Requirements:
- Each question must test a DIFFERENT aspect of reasoning or creativity.
- Questions should require genuine analysis, not simple recall.
- Model answers must be substantive (200+ words) and demonstrate strong reasoning.

{forbidden}

Format as a JSON array:
[
  {{
    "question": "...",
    "word_limit": 250,
    "key_points": ["marking point 1", "marking point 2", "marking point 3", "marking point 4"],
    "model_answer": "A comprehensive 200-250 word model answer...",
    "marking_criteria": "Description of how marks are distributed across key points.",
    "difficulty": "medium|hard",
    "type": "essay"
  }}
]"""


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  Public generation functions
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def _call_groq(system_msg: str, user_msg: str, question_type: str, n: int) -> List[Dict]:
    """Shared Groq API call with logging."""
    client = _get_client()
    try:
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user",   "content": user_msg},
            ],
            max_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
        )
        raw = response.choices[0].message.content
        questions = _parse_json_array(raw)
        logger.info(f"Generated {len(questions)} '{question_type}' questions [n={n}]")
        return questions
    except Exception as exc:
        logger.error(f"Generation failed for '{question_type}': {exc}")
        return []


def generate_structured_questions(
    num_questions: int = 5,
    context: Optional[str] = None,
    previously_asked: Optional[List[str]] = None,
) -> List[Dict]:
    """
    Generate structured (full MCQ) questions via Groq+RAG.

    Args:
        num_questions: How many to generate (1â€“20)
        context: RAG-retrieved source text from FAISS index
        previously_asked: List of questions already seen â€” injected into prompt
    """
    seed = _seed_token()
    forbidden = _forbidden_block(previously_asked or [])

    if context:
        user_msg = STRUCTURED_PROMPT_RAG.format(
            n=num_questions, context=context[:4000], forbidden=forbidden, seed=seed
        )
    else:
        user_msg = STRUCTURED_PROMPT_DIRECT.format(
            n=num_questions, forbidden=forbidden, seed=seed
        )
    return _call_groq(STRUCTURED_SYSTEM, user_msg, "structured", num_questions)


def generate_mini_structured_questions(
    num_questions: int = 5,
    context: Optional[str] = None,
    previously_asked: Optional[List[str]] = None,
) -> List[Dict]:
    """
    Generate mini structured (short, 2â€“4 option) questions via Groq+RAG.
    """
    seed = _seed_token()
    forbidden = _forbidden_block(previously_asked or [])

    if context:
        user_msg = MINI_STRUCTURED_PROMPT_RAG.format(
            n=num_questions, context=context[:4000], forbidden=forbidden, seed=seed
        )
    else:
        user_msg = MINI_STRUCTURED_PROMPT_DIRECT.format(
            n=num_questions, forbidden=forbidden, seed=seed
        )
    return _call_groq(MINI_STRUCTURED_SYSTEM, user_msg, "mini_structured", num_questions)


def generate_essay_questions(
    num_questions: int = 3,
    context: Optional[str] = None,
    previously_asked: Optional[List[str]] = None,
) -> List[Dict]:
    """
    Generate essay questions via Groq+RAG.
    """
    seed = _seed_token()
    forbidden = _forbidden_block(previously_asked or [])

    if context:
        user_msg = ESSAY_PROMPT_RAG.format(
            n=num_questions, context=context[:4000], forbidden=forbidden, seed=seed
        )
    else:
        user_msg = ESSAY_PROMPT_DIRECT.format(
            n=num_questions, forbidden=forbidden, seed=seed
        )
    return _call_groq(ESSAY_SYSTEM, user_msg, "essay", num_questions)

