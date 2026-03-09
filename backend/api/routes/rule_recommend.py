import traceback

from fastapi import APIRouter, HTTPException, Query

from api.schemas.prediction import CourseRecommendationResponse, StudentProfileRequest
from api.services.rule_based_recommender import ELIGIBLE_STREAMS, recommend

router = APIRouter(prefix="/predict", tags=["Rule-Based Recommendation"])


@router.post("/rule-based", response_model=CourseRecommendationResponse)
def predict_rule_based(
    req: StudentProfileRequest,
    top_n: int = Query(default=10, ge=1, le=30, description="Number of recommendations (1–30)"),
    diversity: bool = Query(default=True, description="Limit to 2 courses per university"),
):
    """
    Rule-based course recommendation using stream eligibility, Z-score,
    island rank, and career-interest Q-scores.
    No ML model — deterministic scoring.
    """
    try:
        if req.Stream not in ELIGIBLE_STREAMS:
            raise HTTPException(
                status_code=422,
                detail=f"Unknown stream '{req.Stream}'. Valid streams: {ELIGIBLE_STREAMS}",
            )

        recs = recommend(req, top_n=top_n, diversity=diversity)

        return CourseRecommendationResponse(
            recommendations=recs,
            input_summary={
                "stream": req.Stream,
                "z_score": req.Z_Score,
                "island_rank": req.Island_Rank,
                "district": req.District,
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rule-based/streams")
def list_eligible_streams():
    """Return the list of streams that the rule-based engine supports."""
    return {"streams": ELIGIBLE_STREAMS}
