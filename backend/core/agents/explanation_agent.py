from typing import List, Dict, Any
import asyncio
import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.insert(0, backend_dir)

# Import Gemini client
from llm.deepseek_client import chat as gemini_chat


# System prompt for Gemini
EXPLANATION_SYSTEM = (
    "You are an academic counselor. "
    "Explain clearly and professionally in 3–4 short sentences."
)


# -------------------------------------------------------
# 1️⃣ Simplified Explanation Prompt
# -------------------------------------------------------
def build_explanation_prompt(user: Dict[str, Any], meta: Dict[str, Any]) -> str:
    """Simplified prompt to avoid Gemini safety filters"""
    return f"""Explain why the {meta.get('Course', 'course')} at {meta.get('Location', 'this institution')} is a good match for a student interested in {user.get('interest_area', 'this field')} who wants to become a {user.get('career_goal', 'professional')}. The course offers {meta.get('Study Method', 'study')} for {meta.get('Duration', 'multiple years')} and leads to careers in {meta.get('Career Opportunities', 'relevant fields')}. Write 3-4 concise sentences."""


# -------------------------------------------------------
# 2️⃣ Short-Mode Backup Prompt (guaranteed fast)
# -------------------------------------------------------
def build_short_prompt(user: Dict[str, Any], meta: Dict[str, Any]) -> str:
    return (
        f"Explain in 2 short sentences why '{meta.get('Course')}' is suitable for a "
        f"student interested in {user.get('interest_area')} and aiming to become "
        f"{user.get('career_goal')}."
    )


# -------------------------------------------------------
# 3️⃣ Synchronous LLM wrapper
# -------------------------------------------------------
def try_llm_sync(prompt: str):
    """Get explanation from Gemini"""
    try:
        response = gemini_chat(
            prompt,
            system=EXPLANATION_SYSTEM,
            timeout=30
        )
        
        # Check if response is valid
        if response and not response.startswith("(LLM unavailable") and not response.startswith("(LLM request timed out") and not response.startswith("(LLM returned empty"):
            return response
        
        return None
                
    except Exception as e:
        print(f"⚠️ Gemini request failed: {type(e).__name__}: {e}")
        return None


# -------------------------------------------------------
# 4️⃣ Main function: attaches explanations to ALL items using Gemini
# -------------------------------------------------------
async def add_explanations(user: Dict[str, Any],
                     ranked: List[Dict[str, Any]],
                     top_n: int = 5) -> List[Dict[str, Any]]:

    limit = min(top_n, len(ranked))

    # Generate explanations for all courses using fallback to avoid rate limits
    for i in range(len(ranked)):
        cand = ranked[i]
        meta = cand["metadata"]
        
        # Use simple fallback explanation for all courses to avoid API rate limits
        explanation = (
            f"This {meta.get('Course', 'course')} at {meta.get('Location', 'the campus')} "
            f"is well-suited for students interested in {user.get('interest_area', 'this field')} "
            f"pursuing careers in {user.get('career_goal', 'relevant fields')}. "
            f"The program offers {meta.get('Study Method', 'flexible study options')} over "
            f"{meta.get('Duration', 'the course duration')} and provides comprehensive training "
            f"leading to opportunities in {meta.get('Career Opportunities', 'various career paths')}."
        )
        
        cand["explanation"] = explanation

    return ranked
