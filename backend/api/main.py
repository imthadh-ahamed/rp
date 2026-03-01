import pickle
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn
from pathlib import Path
import traceback

app = FastAPI(title="UGC Admission Forecasting API", version="1.0.0")

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load university prediction artifacts ────────────────────────────────────
MODEL_DIR = Path(__file__).parent / "models"

with open(MODEL_DIR / "ugc_admission_forecasting_pipeline.pkl", "rb") as f:
    loaded_model = pickle.load(f)

with open(MODEL_DIR / "label_encoders.pkl", "rb") as f:
    label_encoders = pickle.load(f)

with open(MODEL_DIR / "scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open(MODEL_DIR / "prophet_values.pkl", "rb") as f:
    prophet_values = pickle.load(f)

with open(MODEL_DIR / "feature_cols.pkl", "rb") as f:
    feature_cols = pickle.load(f)

expected_features = loaded_model.feature_names_in_
print("✅ University model expects:", list(expected_features))

# ─── Load course recommendation artifacts ────────────────────────────────────
with open(MODEL_DIR / "course_prediction_model.pkl", "rb") as f:
    course_model = pickle.load(f)

with open(MODEL_DIR / "label_encoders_course.pkl", "rb") as f:
    label_encoders_course = pickle.load(f)

with open(MODEL_DIR / "scaler_course.pkl", "rb") as f:
    scaler_course = pickle.load(f)

with open(MODEL_DIR / "feature_cols_course.pkl", "rb") as f:
    feature_cols_course = pickle.load(f)

with open(MODEL_DIR / "course_attribute_map.pkl", "rb") as f:
    course_attribute_map = pickle.load(f)

print("✅ Course model loaded. Features:", feature_cols_course)

# ─── Column config ────────────────────────────────────────────────────────────
cat_cols = [
    "Stream", "Subject_1", "Grade_1", "Subject_2", "Grade_2",
    "Subject_3", "Grade_3", "District", "Sinhala/Tamil",
    "English", "Maths", "Science", "Course"
]
num_cols = ["Z_Score", "Island_Rank", "Gen_Test"]


# ─── Schemas ──────────────────────────────────────────────────────────────────

class StudentProfileRequest(BaseModel):
    """Shared student profile — used by both models."""
    Year: float = Field(..., example=2024.0)
    Stream: str = Field(..., example="Physical Science")
    Subject_1: str = Field(..., example="Physics")
    Grade_1: str = Field(..., example="A")
    Subject_2: str = Field(..., example="Chemistry")
    Grade_2: str = Field(..., example="A")
    Subject_3: str = Field(..., example="Combined Mathematics")
    Grade_3: str = Field(..., example="A")
    Z_Score: float = Field(..., example=2.5)
    Island_Rank: float = Field(..., example=100.0)
    District: str = Field(..., example="Colombo")
    Gen_Test: float = Field(..., example=70.0)
    Sinhala_Tamil: str = Field(..., alias="Sinhala/Tamil", example="Sinhala")
    English: str = Field(..., example="A")
    Maths: str = Field(..., example="A")
    Science: str = Field(..., example="B")
    q1_science_tech: float = Field(..., example=5.0)
    q2_healthcare: float = Field(..., example=2.0)
    q3_design: float = Field(..., example=3.0)
    q4_data: float = Field(..., example=4.0)
    q5_business: float = Field(..., example=1.0)
    q6_arts_culture: float = Field(..., example=2.0)
    q7_nature_env: float = Field(..., example=3.0)
    q8_hands_on: float = Field(..., example=5.0)
    q9_innovation: float = Field(..., example=5.0)
    q10_people_social: float = Field(..., example=2.0)
    q11_urban_corporate: float = Field(..., example=4.0)
    q12_flexible_path: float = Field(..., example=5.0)

    class Config:
        populate_by_name = True


class PredictionRequest(StudentProfileRequest):
    """University prediction — extends profile with a specific Course."""
    Course: str = Field(..., example="Computer Science")


class UniversityPrediction(BaseModel):
    university: str
    probability: float


class PredictionResponse(BaseModel):
    top_predictions: list[UniversityPrediction]
    course: str
    input_summary: dict


class CourseRecommendation(BaseModel):
    rank: int
    course: str
    score: float
    university: str
    uni_code: str
    aptitude_required: str


class CourseRecommendationResponse(BaseModel):
    recommendations: list[CourseRecommendation]
    input_summary: dict


class CombinedPredictionRequest(StudentProfileRequest):
    """Combined request — course model picks courses, university model ranks unis."""
    top_n_courses: int = Field(default=5, ge=1, le=20, example=5)


class CourseWithUniversities(BaseModel):
    rank: int
    course: str
    course_score: float
    university: str
    uni_code: str
    aptitude_required: str
    top_university_predictions: list[UniversityPrediction]


class CombinedPredictionResponse(BaseModel):
    results: list[CourseWithUniversities]
    input_summary: dict


# ─── Preprocessing: University model ─────────────────────────────────────────

def preprocess_university(req: PredictionRequest) -> pd.DataFrame:
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

    df[num_cols] = scaler.transform(df[num_cols].values)

    prophet_lookup = prophet_values.set_index("Course")["Prophet_Z"]
    prophet_z = prophet_lookup.get(req.Course, None)
    if prophet_z is None:
        prophet_z = prophet_values["Prophet_Z"].median()

    df["Prophet_Z"] = prophet_z
    df["Z_Score"] = prophet_z

    df = df[[c for c in expected_features if c in df.columns]]
    return df


# ─── Preprocessing: Course model ─────────────────────────────────────────────

def preprocess_course(req: StudentProfileRequest) -> pd.DataFrame:
    raw = req.model_dump(by_alias=True)
    df = pd.DataFrame([raw])

    for col, le in label_encoders_course.items():
        if col in df.columns and pd.api.types.is_string_dtype(df[col].dtype):
            try:
                df[col] = le.transform(df[col])
            except ValueError:
                print(f"⚠️  Unseen label in course model col '{col}', defaulting to 0")
                df[col] = 0

    num_to_scale = [c for c in num_cols if c in df.columns]
    if num_to_scale:
        df[num_to_scale] = scaler_course.transform(df[num_to_scale])

    df = df[feature_cols_course]
    return df


def run_course_model(req: StudentProfileRequest, top_n: int) -> list[CourseRecommendation]:
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


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "UGC Admission Forecasting API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/debug/features")
def debug_features():
    return {
        "university_model_features": list(expected_features),
        "course_model_features": list(feature_cols_course),
    }


@app.get("/debug/model-info")
def debug_model_info():
    return {
        "university_model": {
            "type": str(type(loaded_model)),
            "classes": [str(c) for c in loaded_model.classes_],
            "label_encoder_keys": list(label_encoders.keys()),
        },
        "course_model": {
            "type": str(type(course_model)),
            "label_encoder_keys": list(label_encoders_course.keys()),
        },
    }


# ── University prediction (single) ────────────────────────────────────────────
@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    try:
        processed = preprocess_university(req)
        target_le = label_encoders["University Selected"]
        probas = loaded_model.predict_proba(processed)[0]
        scored = sorted(zip(loaded_model.classes_, probas), key=lambda x: x[1], reverse=True)

        top_predictions = [
            UniversityPrediction(
                university=str(target_le.inverse_transform([int(cls)])[0]),
                probability=round(float(prob) * 100, 2),
            )
            for cls, prob in scored[:10]
        ]

        return PredictionResponse(
            top_predictions=top_predictions,
            course=req.Course,
            input_summary={
                "stream": req.Stream,
                "z_score": req.Z_Score,
                "island_rank": req.Island_Rank,
                "district": req.District,
            },
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ── University prediction (batch) ─────────────────────────────────────────────
@app.post("/predict/batch")
def predict_batch(requests: list[PredictionRequest]):
    results = []
    for req in requests:
        try:
            processed = preprocess_university(req)
            target_le = label_encoders["University Selected"]
            probas = loaded_model.predict_proba(processed)[0]
            scored = sorted(zip(loaded_model.classes_, probas), key=lambda x: x[1], reverse=True)
            top_5 = [
                {
                    "university": str(target_le.inverse_transform([int(cls)])[0]),
                    "probability": round(float(prob) * 100, 2),
                }
                for cls, prob in scored[:10]
            ]
            results.append({"course": req.Course, "top_predictions": top_5, "error": None})
        except Exception as e:
            traceback.print_exc()
            results.append({"course": req.Course, "top_predictions": None, "error": str(e)})
    return {"predictions": results}


# ── Course recommendation ──────────────────────────────────────────────────────
@app.post("/predict/courses", response_model=CourseRecommendationResponse)
def predict_courses(req: StudentProfileRequest, top_n: int = 10):
    try:
        recommendations = run_course_model(req, top_n)
        return CourseRecommendationResponse(
            recommendations=recommendations,
            input_summary={
                "stream": req.Stream,
                "z_score": req.Z_Score,
                "island_rank": req.Island_Rank,
                "district": req.District,
            },
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ── Combined: course recommendations + university probabilities ───────────────
@app.post("/predict/combined", response_model=CombinedPredictionResponse)
def predict_combined(req: CombinedPredictionRequest):
    """
    Single endpoint that:
    1. Runs the course model to find the top N best-fit courses.
    2. Runs the university model for each of those courses.
    Returns both course scores and university admission probabilities together.
    """
    try:
        # Step 1 — course recommendations
        course_recs = run_course_model(req, req.top_n_courses)

        # Step 2 — university predictions for each recommended course
        target_le = label_encoders["University Selected"]
        combined_results = []

        for rec in course_recs:
            # Build a full PredictionRequest by injecting the course name
            uni_req = PredictionRequest(
                **req.model_dump(by_alias=True),
                Course=rec.course,
            )

            try:
                processed = preprocess_university(uni_req)
                probas = loaded_model.predict_proba(processed)[0]
                scored = sorted(
                    zip(loaded_model.classes_, probas), key=lambda x: x[1], reverse=True
                )
                top_unis = [
                    UniversityPrediction(
                        university=str(target_le.inverse_transform([int(cls)])[0]),
                        probability=round(float(prob) * 100, 2),
                    )
                    for cls, prob in scored[:5]
                ]
            except Exception as uni_err:
                print(f"⚠️  University prediction failed for '{rec.course}': {uni_err}")
                top_unis = []

            combined_results.append(CourseWithUniversities(
                rank=rec.rank,
                course=rec.course,
                course_score=rec.score,
                university=rec.university,
                uni_code=rec.uni_code,
                aptitude_required=rec.aptitude_required,
                top_university_predictions=top_unis,
            ))

        return CombinedPredictionResponse(
            results=combined_results,
            input_summary={
                "stream": req.Stream,
                "z_score": req.Z_Score,
                "island_rank": req.Island_Rank,
                "district": req.District,
            },
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)