from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class CareerGoal(str, Enum):
    """Supported career paths"""
    # Tech/IT Careers
    SOFTWARE_ENGINEER = "Software Engineer"
    DATA_ENGINEER = "Data Engineer"
    FULL_STACK_DEVELOPER = "Full Stack Developer"
    DEVOPS_ENGINEER = "DevOps Engineer"
    ML_ENGINEER = "Machine Learning Engineer"
    DATA_SCIENTIST = "Data Scientist"
    
    # Engineering Disciplines
    CIVIL_ENGINEER = "Civil Engineer"
    MECHANICAL_ENGINEER = "Mechanical Engineer"
    ELECTRICAL_ENGINEER = "Electrical Engineer"
    CHEMICAL_ENGINEER = "Chemical Engineer"
    INDUSTRIAL_ENGINEER = "Industrial Engineer"
    
    # Business & Management
    BUSINESS_ANALYST = "Business Analyst"
    PROJECT_MANAGER = "Project Manager"
    FINANCIAL_ANALYST = "Financial Analyst"
    MARKETING_MANAGER = "Marketing Manager"
    HR_MANAGER = "HR Manager"
    ENTREPRENEUR = "Entrepreneur"
    
    # Healthcare/Medicine
    NURSE = "Nurse"
    PHARMACIST = "Pharmacist"
    MEDICAL_TECHNOLOGIST = "Medical Technologist"
    HEALTHCARE_ADMINISTRATOR = "Healthcare Administrator"
    PHYSIOTHERAPIST = "Physiotherapist"
    
    # Education/Teaching
    TEACHER = "Teacher"
    LECTURER = "Lecturer"
    EDUCATION_ADMINISTRATOR = "Education Administrator"
    CURRICULUM_DEVELOPER = "Curriculum Developer"
    
    # Arts & Design
    GRAPHIC_DESIGNER = "Graphic Designer"
    UI_UX_DESIGNER = "UI/UX Designer"
    INTERIOR_DESIGNER = "Interior Designer"
    ANIMATOR = "Animator"
    CONTENT_CREATOR = "Content Creator"
    
    # Agriculture/Environment
    AGRICULTURAL_ENGINEER = "Agricultural Engineer"
    ENVIRONMENTAL_SCIENTIST = "Environmental Scientist"
    SUSTAINABILITY_CONSULTANT = "Sustainability Consultant"
    
    # Generic
    OTHER = "Other"


class StudyMethod(str, Enum):
    """Study method preference"""
    ONSITE = "Onsite"
    ONLINE = "Online"
    HYBRID = "Hybrid"


class Resource(BaseModel):
    """Learning resource with title and URL"""
    title: str = Field(..., description="Resource name")
    url: str = Field(..., description="Resource URL")


class RoadmapStep(BaseModel):
    """Individual roadmap stage/step"""
    id: int = Field(..., description="Step ID (1-6)")
    title: str = Field(..., description="Stage title")
    goal: str = Field(..., description="Main objective of this stage")
    icon: str = Field(default="BookOpen", description="Lucide icon name")
    duration: str = Field(..., description="Estimated duration (e.g., '6-8 Weeks')")
    description: str = Field(..., description="Detailed stage description")
    actionPlan: List[str] = Field(..., description="3-5 actionable steps")
    resources: List[Resource] = Field(..., description="Learning resources with URLs")
    successCriteria: List[str] = Field(..., description="Criteria to complete this stage")


class SelectedCourse(BaseModel):
    """Selected course from recommendation - matches DB structure"""
    # Core fields (required)
    course_name: str = Field(..., description="Course name")
    university: str = Field(..., description="University name")
    duration: str = Field(..., description="Course duration")
    study_method: str = Field(..., description="Study method (Full Time, Part Time, Online)")
    
    # Optional fields from recommendation system
    id: Optional[str] = Field(None, description="Course ID")
    location: Optional[str] = Field(None, description="Location/Campus")
    department: Optional[str] = Field(None, description="Department/Faculty")
    match_score: Optional[float] = Field(None, description="Match score from recommendation")
    explanation: Optional[str] = Field(None, description="Why this course was recommended")
    url: Optional[str] = Field(None, description="Course official URL")
    career_opportunities: Optional[str] = Field(None, description="Career paths after graduation")
    study_language: Optional[str] = Field(None, description="Language of instruction")
    requirements: Optional[str] = Field(None, description="Admission requirements")
    course_fee: Optional[str] = Field(None, description="Course fee information")
    curriculum: Optional[str] = Field(None, description="Detailed curriculum/course content")
    
    # Allow any additional fields from DB
    class Config:
        extra = "allow"


class RoadmapRequest(BaseModel):
    """Request payload for roadmap generation"""
    user_profile: dict = Field(..., description="User profile data from recommendation")
    selected_course: SelectedCourse = Field(..., description="Selected course details")
    career_goal: Optional[CareerGoal] = Field(None, description="Target career path (if not provided, extracted from user_profile.careerGoal)")
    preferences: Optional[dict] = Field(default={}, description="Additional user preferences")
    
    def get_career_goal(self) -> str:
        """Extract career goal from top-level or user_profile"""
        if self.career_goal:
            return self.career_goal.value
        
        # Extract from user_profile
        career_goal_str = self.user_profile.get('careerGoal') or self.user_profile.get('career_goal', '')
        
        # Map to one of the supported career goals
        career_goal_lower = career_goal_str.lower()
        
        # Tech/IT careers
        if 'software engineer' in career_goal_lower or 'software dev' in career_goal_lower:
            return CareerGoal.SOFTWARE_ENGINEER.value
        elif 'data engineer' in career_goal_lower:
            return CareerGoal.DATA_ENGINEER.value
        elif 'full stack' in career_goal_lower:
            return CareerGoal.FULL_STACK_DEVELOPER.value
        elif 'devops' in career_goal_lower:
            return CareerGoal.DEVOPS_ENGINEER.value
        elif 'machine learning' in career_goal_lower or 'ml engineer' in career_goal_lower:
            return CareerGoal.ML_ENGINEER.value
        elif 'data scientist' in career_goal_lower:
            return CareerGoal.DATA_SCIENTIST.value
        
        # Engineering disciplines
        elif 'civil engineer' in career_goal_lower or 'civil eng' in career_goal_lower:
            return CareerGoal.CIVIL_ENGINEER.value
        elif 'mechanical engineer' in career_goal_lower or 'mech eng' in career_goal_lower:
            return CareerGoal.MECHANICAL_ENGINEER.value
        elif 'electrical engineer' in career_goal_lower or 'elect eng' in career_goal_lower or 'electronics' in career_goal_lower:
            return CareerGoal.ELECTRICAL_ENGINEER.value
        elif 'chemical engineer' in career_goal_lower or 'chem eng' in career_goal_lower:
            return CareerGoal.CHEMICAL_ENGINEER.value
        elif 'industrial engineer' in career_goal_lower:
            return CareerGoal.INDUSTRIAL_ENGINEER.value
        elif 'agricultural engineer' in career_goal_lower:
            return CareerGoal.AGRICULTURAL_ENGINEER.value
        
        # Business & Management
        elif 'business analyst' in career_goal_lower:
            return CareerGoal.BUSINESS_ANALYST.value
        elif 'project manager' in career_goal_lower:
            return CareerGoal.PROJECT_MANAGER.value
        elif 'financial analyst' in career_goal_lower or 'finance' in career_goal_lower:
            return CareerGoal.FINANCIAL_ANALYST.value
        elif 'marketing' in career_goal_lower:
            return CareerGoal.MARKETING_MANAGER.value
        elif 'hr ' in career_goal_lower or 'human resource' in career_goal_lower:
            return CareerGoal.HR_MANAGER.value
        elif 'entrepreneur' in career_goal_lower or 'business owner' in career_goal_lower:
            return CareerGoal.ENTREPRENEUR.value
        
        # Healthcare/Medicine
        elif 'nurse' in career_goal_lower or 'nursing' in career_goal_lower:
            return CareerGoal.NURSE.value
        elif 'pharmacist' in career_goal_lower or 'pharmacy' in career_goal_lower:
            return CareerGoal.PHARMACIST.value
        elif 'medical tech' in career_goal_lower or 'lab tech' in career_goal_lower:
            return CareerGoal.MEDICAL_TECHNOLOGIST.value
        elif 'healthcare admin' in career_goal_lower or 'hospital admin' in career_goal_lower:
            return CareerGoal.HEALTHCARE_ADMINISTRATOR.value
        elif 'physiotherap' in career_goal_lower or 'physical therap' in career_goal_lower:
            return CareerGoal.PHYSIOTHERAPIST.value
        
        # Education/Teaching
        elif 'teacher' in career_goal_lower or 'teaching' in career_goal_lower:
            return CareerGoal.TEACHER.value
        elif 'lecturer' in career_goal_lower or 'professor' in career_goal_lower:
            return CareerGoal.LECTURER.value
        elif 'education admin' in career_goal_lower:
            return CareerGoal.EDUCATION_ADMINISTRATOR.value
        elif 'curriculum' in career_goal_lower:
            return CareerGoal.CURRICULUM_DEVELOPER.value
        
        # Arts & Design
        elif 'graphic design' in career_goal_lower:
            return CareerGoal.GRAPHIC_DESIGNER.value
        elif 'ui' in career_goal_lower or 'ux' in career_goal_lower or 'user experience' in career_goal_lower:
            return CareerGoal.UI_UX_DESIGNER.value
        elif 'interior design' in career_goal_lower:
            return CareerGoal.INTERIOR_DESIGNER.value
        elif 'animator' in career_goal_lower or 'animation' in career_goal_lower:
            return CareerGoal.ANIMATOR.value
        elif 'content creator' in career_goal_lower or 'youtuber' in career_goal_lower:
            return CareerGoal.CONTENT_CREATOR.value
        
        # Agriculture/Environment
        elif 'environment' in career_goal_lower:
            return CareerGoal.ENVIRONMENTAL_SCIENTIST.value
        elif 'sustainability' in career_goal_lower:
            return CareerGoal.SUSTAINABILITY_CONSULTANT.value
        
        else:
            # Return OTHER instead of defaulting
            print(f"⚠️ Warning: Career goal '{career_goal_str}' not recognized. Using 'Other'.")
            return CareerGoal.OTHER.value


class RoadmapResponse(BaseModel):
    """Response with generated roadmap"""
    status: str = Field(default="success", description="Response status")
    roadmap: List[RoadmapStep] = Field(..., description="Generated roadmap stages")
    metadata: Optional[dict] = Field(default={}, description="Additional metadata")
    warnings: Optional[List[str]] = Field(default=[], description="Warning messages")
    errors: Optional[List[str]] = Field(default=[], description="Error messages")


# Internal schemas for agent communication

class CurriculumAnalysis(BaseModel):
    """Output from curriculum analysis agent"""
    core_skills: List[str] = Field(..., description="Core skills taught")
    languages: List[str] = Field(..., description="Programming languages")
    focus_area: str = Field(..., description="Main focus area")
    level: str = Field(..., description="Academic level")
    duration_years: float = Field(..., description="Duration in years")


class CareerRequirements(BaseModel):
    """Output from career path agent"""
    required_skills: List[str] = Field(..., description="Industry-required skills")
    optional_skills: List[str] = Field(..., description="Nice-to-have skills")
    role_description: str = Field(..., description="Role overview")
    typical_journey: List[str] = Field(..., description="Typical career progression")


class SkillGapAnalysis(BaseModel):
    """Output from skill gap agent"""
    missing_skills: List[str] = Field(..., description="Skills not covered by course")
    partially_covered: List[str] = Field(..., description="Skills needing reinforcement")
    well_covered: List[str] = Field(..., description="Skills adequately covered")
    priority_gaps: List[str] = Field(..., description="Most critical gaps to address")
