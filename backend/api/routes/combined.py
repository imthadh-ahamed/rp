import traceback

from fastapi import APIRouter, HTTPException

from api.services.csv_recommender import recommend_combined
from api.schemas.prediction import (
    CombinedPredictionRequest,
    CombinedPredictionResponse,
)

router = APIRouter(prefix="/predict", tags=["Combined Prediction"])


@router.post("/combined", response_model=CombinedPredictionResponse)
def predict_combined(req: CombinedPredictionRequest):
    """
    Recommends top courses and their best-match universities for a student
    using Cut-offs.csv data + Q-score interest alignment.
    """
    try:
        results = recommend_combined(req, top_n=req.top_n_courses)

        if not results:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"No eligible courses found for stream '{req.Stream}', "
                    f"district '{req.District}', Z-Score {req.Z_Score}. "
                    "Try a higher Z-Score or a different district."
                ),
            )

        return CombinedPredictionResponse(
            results=results,
            input_summary={
                "stream":       req.Stream,
                "z_score":      req.Z_Score,
                "island_rank":  req.Island_Rank,
                "district":     req.District,
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
