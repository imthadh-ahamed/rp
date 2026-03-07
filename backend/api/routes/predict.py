import traceback

from fastapi import APIRouter, HTTPException

from api.dependencies import loaded_model, label_encoders, preprocess_university
from api.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
    UniversityPrediction,
)

router = APIRouter(prefix="/predict", tags=["University Prediction"])


@router.post("", response_model=PredictionResponse)
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


@router.post("/batch")
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
