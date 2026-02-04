from fastapi import APIRouter, HTTPException
from api.schemas.roadmap import RoadmapRequest, RoadmapResponse, RoadmapStep
from core.agents.roadmap_orchestrator import RoadmapOrchestrator
import traceback

router = APIRouter()

# Initialize orchestrator (can optionally pass LLM client)
orchestrator = RoadmapOrchestrator(llm_client=None)  # TODO: Inject LLM client if needed


@router.post("/generate", response_model=RoadmapResponse)
async def generate_personalized_roadmap(request: RoadmapRequest):
    """
    Generate personalized learning roadmap using Agentic RAG
    
    This endpoint orchestrates multiple AI agents to:
    1. Analyze course curriculum
    2. Map career requirements
    3. Identify skill gaps
    4. Generate 6-stage personalized roadmap
    
    Args:
        request: RoadmapRequest with user_profile, selected_course, career_goal
        
    Returns:
        RoadmapResponse with 6-stage roadmap tailored to user's goals
        
    Example:
        ```
        POST /api/roadmap/generate
        {
          "user_profile": {
            "name": "John Doe",
            "al_stream": "Physical Science",
            "z_score": 1.85
          },
          "selected_course": {
            "id": "123",
            "course_name": "Bachelor of Software Engineering Honours",
            "university": "NSBM Green University",
            "duration": "3-4 Years",
            "study_method": "Onsite",
            "curriculum": "Programming, DSA, Databases..."
          },
          "career_goal": "Software Engineer"
        }
        ```
    """
    try:
        # Call orchestrator to generate roadmap
        result = await orchestrator.generate_roadmap(request)
        
        # Map result to response schema
        return RoadmapResponse(
            status=result["status"],
            roadmap=result["roadmap"],
            metadata=result["metadata"],
            warnings=result.get("warnings", []),
            errors=result.get("errors", [])
        )
    
    except Exception as e:
        print(f"API Error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint for roadmap service"""
    return {
        "status": "healthy",
        "service": "roadmap-generation",
        "agents": [
            "curriculum_agent",
            "career_path_agent",
            "skill_gap_agent",
            "roadmap_planning_agent"
        ]
    }
