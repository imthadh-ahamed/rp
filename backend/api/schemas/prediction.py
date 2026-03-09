from pydantic import BaseModel, Field
from typing import Optional


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
    top_n_courses: int = Field(default=5, ge=1, le=20, example=10)


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
