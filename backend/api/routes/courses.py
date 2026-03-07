import traceback

from fastapi import APIRouter, HTTPException

from api.services.csv_recommender import recommend_combined
from api.schemas.prediction import (
    StudentProfileRequest,
    CourseRecommendation,
    CourseRecommendationResponse,
)

router = APIRouter(prefix="/predict", tags=["Course Recommendation"])


@router.post("/courses", response_model=CourseRecommendationResponse)
def predict_courses(req: StudentProfileRequest, top_n: int = 10):
    try:
        combined = recommend_combined(req, top_n=top_n)
        recommendations = [
            CourseRecommendation(
                rank=c.rank,
                course=c.course,
                score=c.course_score,
                university=c.university,
                uni_code=c.uni_code,
                aptitude_required=c.aptitude_required,
            )
            for c in combined
        ]
        return CourseRecommendationResponse(
            recommendations=recommendations,
            input_summary={
                "stream":      req.Stream,
                "z_score":     req.Z_Score,
                "island_rank": req.Island_Rank,
                "district":    req.District,
            },
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
