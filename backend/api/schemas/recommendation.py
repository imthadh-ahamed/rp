from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UserProfile(BaseModel):
    age: Optional[str] = Field(None, description="Age of the student")
    native_language: Optional[str] = Field(None, description="Native language")
    preferred_language: Optional[str] = Field(None, description="Preferred study language")
    ol_results: Optional[str] = Field(None, description="O/L Results summary")
    al_stream: Optional[str] = Field(None, description="A/L Stream")
    al_results: Optional[str] = Field(None, description="A/L Results summary")
    other_qualifications: Optional[str] = Field(None, description="Other qualifications")
    ielts: Optional[str] = Field(None, description="IELTS Score")
    interest_area: Optional[str] = Field(None, description="Area of interest")
    career_goal: Optional[str] = Field(None, description="Career goal")
    income: Optional[str] = Field(None, description="Monthly family income")
    study_method: Optional[str] = Field(None, description="Study method preference")
    availability: Optional[str] = Field(None, description="Weekend/Weekday availability")
    completion_period: Optional[str] = Field(None, description="Target completion period")
    current_location: Optional[str] = Field(None, description="Current location")
    preferred_locations: Optional[str] = Field(None, description="Preferred study locations")

class RecommendationResult(BaseModel):
    rank: int
    course_name: str
    university: str
    location: str
    match_score: float
    explanation: str
    url: Optional[str] = None
    career_opportunities: Optional[str] = "N/A"
    study_language: Optional[str] = "N/A"
    study_method: Optional[str] = "N/A"
    duration: Optional[str] = "N/A"
    requirements: Optional[str] = "N/A"
    course_fee: Optional[str] = "N/A"
    department: Optional[str] = "N/A"
    tags: List[str] = []

class RecommendationResponse(BaseModel):
    status: str
    recommendations: List[RecommendationResult]
    warnings: List[str] = []
    errors: List[str] = []
