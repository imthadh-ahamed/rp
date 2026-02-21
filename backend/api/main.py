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

# ─── CORS ───────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load model & artifacts ──────────────────────────────────────────────────
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
print("✅ Model expects these features:", list(expected_features))
print("✅ Feature count:", len(expected_features))
print("📏 Scaler trained on:", scaler.feature_names_in_)

# ─── Column config ───────────────────────────────────────────────────────────
cat_cols = [
    "Stream", "Subject_1", "Grade_1", "Subject_2", "Grade_2",
    "Subject_3", "Grade_3", "District", "Sinhala/Tamil",
    "English", "Maths", "Science", "Course"
]

num_cols = ["Z_Score", "Island_Rank", "Gen_Test"]


# ─── Request / Response Schemas ──────────────────────────────────────────────
class PredictionRequest(BaseModel):
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
    Course: str = Field(..., example="Computer Science")

    class Config:
        populate_by_name = True


class UniversityPrediction(BaseModel):
    university: str
    probability: float  # percentage e.g. 34.5


class PredictionResponse(BaseModel):
    top_predictions: list[UniversityPrediction]
    course: str
    input_summary: dict


# ─── Preprocessing ───────────────────────────────────────────────────────────
def preprocess(req: PredictionRequest) -> pd.DataFrame:
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

    missing = [c for c in expected_features if c not in df.columns]
    extra   = [c for c in df.columns if c not in list(expected_features)]
    if missing: print("⚠️  Missing from df:", missing)
    if extra:   print("➕ Extra in df (will be dropped):", extra)

    df = df[[c for c in expected_features if c in df.columns]]
    return df


# ─── Routes ──────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "UGC Admission Forecasting API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/debug/features")
def debug_features():
    return {
        "model_expects": list(expected_features),
        "scaler_cols": list(scaler.feature_names_in_),
        "count": len(expected_features)
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    try:
        processed = preprocess(req)
        target_le = label_encoders["University Selected"]

        # predict_proba returns probabilities for all classes
        probas = loaded_model.predict_proba(processed)[0]

        # Pair each university with its probability, sort descending
        scored = sorted(
            zip(target_le.classes_, probas),
            key=lambda x: x[1],
            reverse=True
        )

        top_20 = [
            UniversityPrediction(
                university=uni,
                probability=round(float(prob) * 100, 2)
            )
            for uni, prob in scored[:20]
            if prob > 0  # skip zero-probability entries
        ]

        return PredictionResponse(
            top_predictions=top_20,
            course=req.Course,
            input_summary={
                "stream": req.Stream,
                "z_score": req.Z_Score,
                "island_rank": req.Island_Rank,
                "district": req.District,
            },
        )
    except Exception as e:
        print(f"❌ ERROR in /predict: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/batch")
def predict_batch(requests: list[PredictionRequest]):
    results = []
    for req in requests:
        try:
            processed = preprocess(req)
            target_le = label_encoders["University Selected"]
            probas = loaded_model.predict_proba(processed)[0]
            scored = sorted(zip(target_le.classes_, probas), key=lambda x: x[1], reverse=True)
            top_5 = [{"university": u, "probability": round(float(p) * 100, 2)} for u, p in scored[:5]]
            results.append({"course": req.Course, "top_predictions": top_5, "error": None})
        except Exception as e:
            print(f"❌ ERROR in /predict/batch for {req.Course}: {e}")
            traceback.print_exc()
            results.append({"course": req.Course, "top_predictions": None, "error": str(e)})
    return {"predictions": results}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)