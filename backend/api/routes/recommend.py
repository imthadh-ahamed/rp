from fastapi import APIRouter, HTTPException
from api.schemas.recommendation import UserProfile, RecommendationResponse, RecommendationResult
from core.agents.orchestrator import recommend_courses
import traceback

router = APIRouter()

@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(profile: UserProfile):
    """
    Generate course recommendations based on user profile.
    """
    try:
        # Convert Pydantic model to dict
        user_data = profile.model_dump(exclude_none=True)
        
        # Call the orchestrator
        # We use default k values for now, can be parameterized if needed
        response = await recommend_courses(user_data, initial_k=25, final_k=10, explain_top_n=5)
        
        if response["status"] == "error":
            # If it's a critical error, we might still want to return a 200 with error status
            # or a 400. Let's return the structure as is for the frontend to handle.
            pass

        # Map responses to schema
        mapped_recommendations = []
        if response.get("results"):
            for index, item in enumerate(response["results"], start=1):
                meta = item.get("metadata", {})

                # Helper to extract value from document text
                doc_text = item.get("document", "")
                
                def extract_field(label):
                    try:
                        # Case insensitive search
                        lower_doc = doc_text.lower()
                        lower_label = label.lower()
                        
                        if lower_label in lower_doc:
                            # Find start index using lower case
                            start_idx = lower_doc.find(lower_label) + len(label)
                            # Extract substring from original text
                            substring = doc_text[start_idx:]
                            
                            # Get first line
                            part = substring.split("\n")[0].strip()
                            
                            # If empty, check next line (handle formatting where value is on next line)
                            if not part and "\n" in substring:
                                part = substring.split("\n")[1].strip()
                                
                            return part.strip(": ")
                    except:
                        return "N/A"
                    return "N/A"

                # More robust extraction for multiline fields
                def extract_multiline(label):
                    try:
                        lower_doc = doc_text.lower()
                        lower_label = label.lower()
                        
                        if lower_label in lower_doc:
                            start_idx = lower_doc.find(lower_label) + len(label)
                            content = doc_text[start_idx:]
                            
                            # Take content up to next double newline or end
                            if "\n\n" in content:
                                return content.split("\n\n")[0].strip().strip(": ")
                            return content.strip().strip(": ")
                    except:
                        return "N/A"
                    return "N/A"

                mapped_recommendations.append(RecommendationResult(
                    rank=index,
                    course_name=item.get("course", "Unknown"),
                    university=meta.get("campus", "Unknown"),
                    department=meta.get("department", "Unknown"),
                    location=meta.get("location", "Unknown"),
                    match_score=item.get("score", 0.0),
                    career_opportunities=extract_multiline("Career Opportunities"),
                    study_language=extract_field("Study Language"),
                    study_method=extract_field("Study Method"),
                    duration=meta.get("duration", "Unknown"),
                    requirements=extract_multiline("Admission Requirements"),
                    course_fee=extract_field("Fees"),
                    explanation=item.get("explanation", "No explanation provided."),
                    tags=[
                        f"{item.get('score', 0.0):.0f}%", 
                        extract_field("Study Language"), 
                        extract_field("Study Method")
                    ],
                    url=meta.get("url", "Null")
                ))
        
        return RecommendationResponse(
            status=response.get("status", "success"),
            recommendations=mapped_recommendations,
            warnings=response.get("warnings", []),
            errors=response.get("errors", [])
        )

    except Exception as e:
        print(f"API Error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
