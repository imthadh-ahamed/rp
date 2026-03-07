"""
CSV-based course + university recommendation engine.
All predictions are derived from Cut-offs.csv and related lookup tables —
no trained ML models required.
"""

import pandas as pd
from pathlib import Path

from api.schemas.prediction import (
    StudentProfileRequest,
    CourseWithUniversities,
    UniversityPrediction,
)

# ─── Data paths ───────────────────────────────────────────────────────────────
_DATA = Path(__file__).parent.parent / "models" / "data" / "Input_data"

# Load once at import time
cutoffs_df      = pd.read_csv(_DATA / "Cut-offs.csv")
courses_df      = pd.read_csv(_DATA / "Course Names, Uni Names & Uni Codes.csv")
aptitude_df     = pd.read_csv(_DATA / "Aptitude Course Names, Uni Names & Uni Codes.csv")

# Normalize column names (trim whitespace)
cutoffs_df.columns = cutoffs_df.columns.str.strip()
courses_df.columns = courses_df.columns.str.strip()
aptitude_df.columns = aptitude_df.columns.str.strip()

# Coerce Zscore to float — some rows contain "NQC" or other text
cutoffs_df["Zscore"] = pd.to_numeric(cutoffs_df["Zscore"], errors="coerce")
cutoffs_df.dropna(subset=["Zscore"], inplace=True)

# ─── Lookup tables ────────────────────────────────────────────────────────────
# (COURSE_UPPER, UNI_UPPER) → uni_code
_uni_code_lookup: dict[tuple[str, str], str] = {}

for _, row in courses_df.iterrows():
    key = (
        str(row["Course of Study"]).upper().strip(),
        str(row["University/ Campus/ Institute"]).upper().strip(),
    )
    _uni_code_lookup[key] = str(row["Uni-Code"]).strip()

for _, row in aptitude_df.iterrows():
    key = (
        str(row["Course of Study"]).upper().strip(),
        str(row["University/ Campus/ Institute"]).upper().strip(),
    )
    _uni_code_lookup[key] = str(row["Uni-Code"]).strip()

# Set of courses that require aptitude test (uppercase)
_aptitude_courses: set[str] = set(
    aptitude_df["Course of Study"].str.upper().str.strip().tolist()
)

# ─── Stream name normalisation ────────────────────────────────────────────────
# Map incoming API stream names → Cut-offs.csv stream names
_STREAM_MAP = {
    "physical science": "Physical Science",
    "biological science": "Biological Science",
    "commerce": "Commerce",
    "arts": "Arts",
    "engineering technology": "Engineering Technology",
    "biosystems technology": "Biosystems Technology",
    "common / multi-stream": "Cross Stream",
    "information communication technology": "Information Communication Technology",
}

def _normalise_stream(stream: str) -> str:
    return _STREAM_MAP.get(stream.strip().lower(), stream.strip())


# ─── Q-score interest alignment ───────────────────────────────────────────────
# Keywords that connect a course name to each Q-dimension
_Q_KEYWORDS = {
    "q1":  ["engineer", "physics", "technology", "computer", "information", "electrical",
             "electronic", "mechanical", "civil", "chemical", "data", "computing", "ict"],
    "q2":  ["medicine", "dental", "pharmacy", "nursing", "health", "medical",
             "veterinary", "bio", "clinical"],
    "q3":  ["architecture", "design", "art", "fashion", "fine art", "performing",
             "interactive", "creative", "spatial"],
    "q4":  ["computer", "data", "statistics", "information", "mathematics", "actuarial",
             "analytics", "management science"],
    "q5":  ["business", "management", "commerce", "accounting", "finance", "economics",
             "marketing", "entrepreneurship", "banking"],
    "q6":  ["arts", "music", "drama", "film", "language", "literature", "cultural",
             "media", "mass", "journalism"],
    "q7":  ["agriculture", "veterinary", "environment", "forestry", "aquatic",
             "fisheries", "nature", "biosystem", "ecological"],
    "q8":  ["engineer", "agriculture", "construction", "surveying", "nursing",
             "manufacturing", "mechanical", "hands"],
    "q9":  ["engineer", "computer", "architecture", "technology", "innovation",
             "project", "research", "robotics"],
    "q10": ["medicine", "social", "education", "law", "psychology", "nursing",
             "counselling", "public health", "sociology"],
    "q11": ["business", "management", "law", "finance", "banking", "accounting",
             "corporate", "commerce"],
    "q12": ["arts", "social", "education", "media", "language", "psychology",
             "humanities", "liberal"],
}

_Q_ATTRS = [
    "q1_science_tech", "q2_healthcare", "q3_design", "q4_data",
    "q5_business", "q6_arts_culture", "q7_nature_env", "q8_hands_on",
    "q9_innovation", "q10_people_social", "q11_urban_corporate", "q12_flexible_path",
]
_Q_KEYS = [f"q{i+1}" for i in range(12)]


def _q_interest_score(course_name: str, req: StudentProfileRequest) -> float:
    """
    Returns a 0–1 interest alignment score by matching course keywords
    against the student's Q-answers.
    """
    name_lower = course_name.lower()
    q_values = [getattr(req, attr) for attr in _Q_ATTRS]

    score = 0.0
    weight = 0.0
    for qk, qv in zip(_Q_KEYS, q_values):
        for kw in _Q_KEYWORDS[qk]:
            if kw in name_lower:
                score  += float(qv)
                weight += 5.0   # max score per Q dimension
                break

    return (score / weight) if weight > 0 else 0.5   # neutral if no keyword hit


# ─── Admission probability heuristic ─────────────────────────────────────────
def _admission_prob(gap: float) -> float:
    """
    gap = student_Z - cutoff_Z
    Returns estimated probability (0–100).
    """
    if   gap >= 0.50: return 95.0
    elif gap >= 0.30: return 87.0
    elif gap >= 0.15: return 76.0
    elif gap >= 0.05: return 65.0
    elif gap >= 0.00: return 55.0
    elif gap >= -0.10: return 35.0
    elif gap >= -0.20: return 20.0
    else:              return 10.0


# ─── Main recommendation function ────────────────────────────────────────────
def recommend_combined(
    req: StudentProfileRequest,
    top_n: int = 10,
) -> list[CourseWithUniversities]:
    """
    Build a ranked list of (course, universities) pairs for the given student.

    Algorithm
    ---------
    1. Normalise stream and filter the latest year of Cut-offs.
    2. Match the student's district; fall back to all-district data if empty.
    3. Add rows where Z_Score is within 0.3 below the cutoff (near-miss courses).
    4. For each (Course, University) row compute an admission probability.
    5. Group by Course; compute:
         - average admission probability
         - Q-interest alignment
         - intake volume bonus
         - composite score = 0.40·q + 0.40·prob + 0.20·intake
    6. Sort by composite score; return top_n CourseWithUniversities objects.
    """
    norm_stream = _normalise_stream(req.Stream)
    latest_year = int(cutoffs_df["Academic Year"].max())

    # Filter by stream + latest year
    mask_stream = (
        cutoffs_df["Stream"].str.strip().str.lower() == norm_stream.lower()
    )
    stream_df = cutoffs_df[mask_stream & (cutoffs_df["Academic Year"] == latest_year)].copy()

    if stream_df.empty:
        # Fall back: try all years
        stream_df = cutoffs_df[mask_stream].copy()

    if stream_df.empty:
        return []

    # District filter (case-insensitive)
    district_mask = (
        stream_df["District"].str.strip().str.lower() == req.District.strip().lower()
    )
    district_df = stream_df[district_mask]

    # Fall back to national if no district data
    if district_df.empty:
        district_df = stream_df

    # Include eligible + near-miss courses — progressive fallback so we always return results
    # Pass 1: district data, near-miss 0.30
    NEAR_MISS = 0.30
    eligible = district_df[
        district_df["Zscore"] <= (req.Z_Score + NEAR_MISS)
    ].copy()

    # Pass 2: national data, near-miss 0.30
    if eligible.empty:
        eligible = stream_df[
            stream_df["Zscore"] <= (req.Z_Score + NEAR_MISS)
        ].copy()

    # Pass 3: national data, expanded near-miss 0.80
    if eligible.empty:
        eligible = stream_df[
            stream_df["Zscore"] <= (req.Z_Score + 0.80)
        ].copy()

    # Pass 4: show the most accessible courses for this stream (lowest cutoffs)
    # — always gives students useful "aspirational" results
    if eligible.empty:
        eligible = stream_df.copy()
        eligible = eligible.sort_values("Zscore").head(top_n * 10)

    if eligible.empty:
        return []

    # Compute admission probability per row
    eligible["gap"]  = req.Z_Score - eligible["Zscore"]
    eligible["prob"] = eligible["gap"].apply(_admission_prob)

    # Aggregate by Course
    results = []
    for course_name, group in eligible.groupby("Course", sort=False):
        course_str = str(course_name).strip()
        q_score    = _q_interest_score(course_str, req)
        avg_prob   = float(group["prob"].mean())

        intake_col = "Intake" if "Intake" in group.columns else None
        if intake_col:
            try:
                total_intake = float(pd.to_numeric(group[intake_col], errors="coerce").sum())
            except Exception:
                total_intake = 100.0
        else:
            total_intake = 100.0

        intake_bonus = min(1.0, total_intake / 500.0)
        composite    = round(0.40 * q_score + 0.40 * (avg_prob / 100.0) + 0.20 * intake_bonus, 4)

        # Build top-university list for this course
        top_unis: list[dict] = []
        for _, row in group.sort_values("prob", ascending=False).head(5).iterrows():
            uni_name  = str(row["University"]).strip()
            uni_code  = _uni_code_lookup.get(
                (course_str.upper(), uni_name.upper()), "N/A"
            )
            top_unis.append({
                "university": uni_name,
                "probability": round(float(row["prob"]), 1),
                "uni_code": uni_code,
            })

        if not top_unis:
            continue

        apt_required = "Yes" if course_str.upper() in _aptitude_courses else "No"

        results.append({
            "course":          course_str,
            "score":           composite,
            "best_uni":        top_unis[0]["university"],
            "best_uni_code":   top_unis[0]["uni_code"],
            "aptitude_required": apt_required,
            "top_unis":        top_unis,
        })

    # Sort by composite score descending
    results.sort(key=lambda x: x["score"], reverse=True)

    output: list[CourseWithUniversities] = []
    for rank, r in enumerate(results[:top_n], start=1):
        output.append(
            CourseWithUniversities(
                rank=rank,
                course=r["course"],
                course_score=r["score"],
                university=r["best_uni"],
                uni_code=r["best_uni_code"],
                aptitude_required=r["aptitude_required"],
                top_university_predictions=[
                    UniversityPrediction(
                        university=u["university"],
                        probability=u["probability"],
                    )
                    for u in r["top_unis"]
                ],
            )
        )

    return output
