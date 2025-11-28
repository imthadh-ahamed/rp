from typing import List, Dict, Any
from llm.deepseek_client import client, DEEPSEEK_MODEL
import asyncio


# System prompt (kept short for DeepSeek)
EXPLANATION_SYSTEM = (
    "You are an academic counselor. "
    "Explain clearly and professionally in 3–4 short sentences."
)


# -------------------------------------------------------
# 1️⃣ Perfect Explanation Prompt (Short + Very Detailed)
# -------------------------------------------------------
def build_explanation_prompt(user: Dict[str, Any], meta: Dict[str, Any]) -> str:
    """
    Short but information-rich prompt.
    Designed specifically to avoid DeepSeek timeouts.
    """
    return f"""
You are an academic counselor. Explain clearly why this course is a strong match
for the student. Write 3–4 short sentences. Cover:

• alignment with interest area
• support for career goal
• match with preferred study method & location
• suitability based on academic background

STUDENT:
- Interest Area: {user.get('interest_area')}
- Career Goal: {user.get('career_goal')}
- Study Method: {user.get('study_method')}
- Preferred Location: {user.get('preferred_locations')}
- A/L Stream: {user.get('al_stream')}
- A/L Results: {user.get('al_results')}
- Other Qualifications: {user.get('other_qualifications')}

COURSE:
- Title: {meta.get('Course')}
- Location: {meta.get('Location')}
- Method: {meta.get('Study Method')}
- Duration: {meta.get('Duration')}
- Career Opportunities: {meta.get('Career Opportunities')}
"""


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
# 3️⃣ Async timeout-safe LLM wrapper (retry + fast exit)
# -------------------------------------------------------
async def try_llm(prompt: str, retries: int = 2):
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model=DEEPSEEK_MODEL,
                messages=[
                    {"role": "system", "content": EXPLANATION_SYSTEM},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=160,
                temperature=0.2,
                timeout=30  # ⬅ KEY: prevents freezing or long waits
            )
            return response.choices[0].message.content.strip()

        except Exception:
            # small delay before retrying
            await asyncio.sleep(0.25)

    return None


# -------------------------------------------------------
# 4️⃣ Rule-based fallback explanation (never fails)
# -------------------------------------------------------
def fallback_explanation(user: Dict[str, Any], meta: Dict[str, Any], score: float) -> str:
    interest = user.get("interest_area") or "your chosen field"
    career = user.get("career_goal") or "your career path"
    location = user.get("preferred_locations") or meta.get("Location") or "your area"

    return (
        f"This course aligns well with your interest in {interest} and supports your goal "
        f"of becoming {career}. It is offered in or near your preferred location "
        f"({location}) and provides career opportunities relevant to your path "
        f"(match score: {score:.0f}/100)."
    )

# -------------------------------------------------------
# 5️⃣ Main function: attaches explanations to top N items
# -------------------------------------------------------
async def add_explanations(user: Dict[str, Any],
                     ranked: List[Dict[str, Any]],
                     top_n: int = 5) -> List[Dict[str, Any]]:

    limit = min(top_n, len(ranked))

    # Run each explanation sequentially (safe for local models)
    for i in range(limit):
        cand = ranked[i]
        meta = cand["metadata"]

        long_prompt = build_explanation_prompt(user, meta)

        # First attempt: detailed prompt
        explanation = await try_llm(long_prompt)

        # Second attempt: short prompt
        if not explanation:
            short_prompt = build_short_prompt(user, meta)
            explanation = await try_llm(short_prompt)

        # Final fallback (rule-based)
        if not explanation:
            explanation = fallback_explanation(user, meta, cand.get("score", 0.0))

        cand["explanation"] = explanation

    # For remaining items, use rule-based explanation
    for i in range(limit, len(ranked)):
        cand = ranked[i]
        meta = cand["metadata"]
        cand["explanation"] = fallback_explanation(user, meta, cand.get("score", 0.0))

    return ranked
