"""
Shared ML model loading and preprocessing utilities.
Imported by route modules to avoid duplication.

NOTE: pkl model files are optional — if absent (or contain None), the server
still starts and CSV-based recommendations are used instead.
"""

import pickle
import pandas as pd
import numpy as np
from pathlib import Path

from api.schemas.prediction import (
    StudentProfileRequest,
    PredictionRequest,
    CourseRecommendation,
)

# ─── Paths ────────────────────────────────────────────────────────────────────
MODEL_DIR = Path(__file__).parent / "models"


def _safe_load(path: Path):
    """Load a pickle file, returning None if missing or containing None."""
    try:
        with open(path, "rb") as f:
            obj = pickle.load(f)
        if obj is None:
            print(f"[WARN] {path.name}: placeholder (None) -- ML model unavailable")
        else:
            print(f"[OK] Loaded {path.name}")
        return obj
    except FileNotFoundError:
        print(f"[WARN] {path.name}: not found -- ML model unavailable")
        return None
    except Exception as e:
        print(f"[WARN] {path.name}: failed to load ({e})")
        return None


# ─── University prediction artifacts (optional) ───────────────────────────────
loaded_model    = _safe_load(MODEL_DIR / "ugc_admission_forecasting_pipeline.pkl")
label_encoders  = _safe_load(MODEL_DIR / "label_encoders.pkl")  or {}
scaler          = _safe_load(MODEL_DIR / "scaler.pkl")
prophet_values  = _safe_load(MODEL_DIR / "prophet_values.pkl")
feature_cols    = _safe_load(MODEL_DIR / "feature_cols.pkl")

if loaded_model is not None and hasattr(loaded_model, "feature_names_in_"):
    expected_features = loaded_model.feature_names_in_
    print("[OK] University model expects:", list(expected_features))
else:
    expected_features = []
    print("[INFO] University ML model not available -- CSV engine will be used")

# ─── Course recommendation artifacts (optional) ───────────────────────────────
course_model         = _safe_load(MODEL_DIR / "course_prediction_model.pkl")
label_encoders_course = _safe_load(MODEL_DIR / "label_encoders_course.pkl") or {}
scaler_course        = _safe_load(MODEL_DIR / "scaler_course.pkl")
feature_cols_course  = _safe_load(MODEL_DIR / "feature_cols_course.pkl")
course_attribute_map = _safe_load(MODEL_DIR / "course_attribute_map.pkl")

if course_model is not None:
    print("[OK] Course ML model ready")
else:
    print("[INFO] Course ML model not available -- CSV engine will be used")

# ─── Column config ─────────────────────────────────────────────────────────────
cat_cols = [
    "Stream", "Subject_1", "Grade_1", "Subject_2", "Grade_2",
    "Subject_3", "Grade_3", "District", "Sinhala/Tamil",
    "English", "Maths", "Science", "Course"
]
num_cols = ["Z_Score", "Island_Rank", "Gen_Test"]


# ─── Preprocessing: University model ──────────────────────────────────────────

def preprocess_university(req: PredictionRequest) -> pd.DataFrame:
    if loaded_model is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="University ML model not loaded.")
    raw = req.model_dump(by_alias=True)
    df = pd.DataFrame([raw])

    for col in cat_cols:
        if col in df.columns and col in label_encoders:
            le = label_encoders[col]
            df[col] = df[col].map(
                lambda s, le=le: (
                    le.transform([s])[0]
                    if s in le.classes_
                    else le.transform(["Unknown"])[0]
                )
            )

    if scaler is not None:
        df[num_cols] = scaler.transform(df[num_cols].values)

    if prophet_values is not None:
        prophet_lookup = prophet_values.set_index("Course")["Prophet_Z"]
        prophet_z = prophet_lookup.get(req.Course, None)
        if prophet_z is None:
            prophet_z = prophet_values["Prophet_Z"].median()
        df["Prophet_Z"] = prophet_z
        df["Z_Score"] = prophet_z

    df = df[[c for c in expected_features if c in df.columns]]
    return df


# ─── Preprocessing: Course model ──────────────────────────────────────────────

def preprocess_course(req: StudentProfileRequest) -> pd.DataFrame:
    raw = req.model_dump(by_alias=True)
    df = pd.DataFrame([raw])

    for col, le in label_encoders_course.items():
        if col in df.columns and pd.api.types.is_string_dtype(df[col].dtype):
            try:
                df[col] = le.transform(df[col])
            except ValueError:
                print(f"[WARN] Unseen label in course model col '{col}', defaulting to 0")
                df[col] = 0

    num_to_scale = [c for c in num_cols if c in df.columns]
    if num_to_scale and scaler_course is not None:
        df[num_to_scale] = scaler_course.transform(df[num_to_scale])

    if feature_cols_course is not None:
        df = df[feature_cols_course]
    return df


def run_course_model(req: StudentProfileRequest, top_n: int) -> list[CourseRecommendation]:
    from fastapi import HTTPException
    if course_model is None:
        raise HTTPException(status_code=503, detail="Course ML model not loaded.")
    if course_attribute_map is None:
        raise HTTPException(status_code=503, detail="Course attribute map not loaded.")
    processed = preprocess_course(req)
    probas = course_model.predict_proba(processed)[0]
    sorted_indices = np.argsort(probas)[::-1]

    results = []
    for rank, encoded_id in enumerate(sorted_indices[:top_n], start=1):
        score = probas[encoded_id]
        attrs = course_attribute_map[course_attribute_map["Course"] == encoded_id]

        decoded_course = label_encoders_course["Course"].inverse_transform([encoded_id])[0]

        if not attrs.empty:
            row = attrs.iloc[0]
            university  = label_encoders_course["University"].inverse_transform([row["University"]])[0]
            uni_code    = label_encoders_course["Uni Code"].inverse_transform([row["Uni Code"]])[0]
            aptitude    = label_encoders_course["aptitude_required"].inverse_transform([row["aptitude_required"]])[0]
        else:
            university = uni_code = aptitude = "Unknown"

        results.append(CourseRecommendation(
            rank=rank,
            course=decoded_course,
            score=round(float(score), 4),
            university=university,
            uni_code=uni_code,
            aptitude_required=aptitude,
        ))

    return results
