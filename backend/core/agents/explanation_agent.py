from typing import List, Dict, Any
import asyncio
import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.insert(0, backend_dir)

# Import Gemini client and career intent checker
from llm.deepseek_client import chat as gemini_chat
from core.agents.career_intent import matches_career_domain


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
# 4️⃣ Main function: attaches explanations to ALL items using career-aware logic
# -------------------------------------------------------
async def add_explanations(user: Dict[str, Any],
                     ranked: List[Dict[str, Any]],
                     top_n: int = 5) -> List[Dict[str, Any]]:

    limit = min(top_n, len(ranked))
    career_goal = user.get("career_goal", "")

    # Generate explanations for all courses using career-aware fallback
    for i in range(len(ranked)):
        cand = ranked[i]
        meta = cand["metadata"]
        score = cand.get("score", 0.0)
        
        # Get course details
        course_name = meta.get("Course", meta.get("course", "this course"))
        location = meta.get("Location", meta.get("location", meta.get("campus", "the campus")))
        interest = user.get("interest_area", "this field")
        study_method = meta.get("Study Method", meta.get("study_method", "flexible study options"))
        duration = meta.get("Duration", meta.get("duration", "the course duration"))
        
        # Build searchable course text to check career alignment
        course_text = " ".join([
            course_name,
            meta.get("department", ""),
            meta.get("Department", ""),
            meta.get("Career Opportunities", ""),
        ])
        
        # Check if course matches career domain
        is_career_aligned = matches_career_domain(career_goal, course_text)
        
        # Generate career-appropriate explanation
        if is_career_aligned and career_goal:
            # Direct career match - positive explanation
            explanation = (
                f"This {course_name} at {location} is well-suited for students interested in "
                f"{interest} pursuing careers in {career_goal}. The program offers {study_method} "
                f"over {duration} and provides comprehensive training leading to opportunities in "
                f"various career paths."
            )
        elif career_goal:
            # Career mismatch - honest explanation without misleading user
            explanation = (
                f"This {course_name} at {location} focuses on {interest}-related skills and offers "
                f"{study_method} over {duration}. While not directly aligned with {career_goal}, "
                f"it provides transferable engineering/technical skills that may support related career paths."
            )
        else:
            # No career goal specified - generic explanation
            explanation = (
                f"This {course_name} at {location} aligns with your interest in {interest}. "
                f"The program offers {study_method} over {duration} and provides comprehensive "
                f"training leading to opportunities in various career paths."
            )
        
        cand["explanation"] = explanation

    return ranked
