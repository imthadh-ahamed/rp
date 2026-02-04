from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Any
from pydantic import BaseModel
from core.services import al_predictor_service

router = APIRouter(prefix="/api/predict", tags=["AL Predictor"])

class StudentMarks(BaseModel):
    first_language: float = 0
    english: float = 0
    mathematics: float = 0
    science: float = 0
    history: float = 0
    religion: float = 0
    Geography: float = 0
    Civic_Education: float = 0
    Business_and_Accounting_Studies: float = 0
    Second_Language: float = 0
    ICT: float = 0
    Agriculture_and_Food_Technology: float = 0
    Health_and_Physical_Education: float = 0
    Art: float = 0
    Music: float = 0
    Dance: float = 0
    Drama: float = 0
    Literature: float = 0
    
    # Allow mapping of frontend fields (e.g. 'Civic Education' -> 'Civic_Education')
    class Config:
        populate_by_name = True
        extra = "allow" 

@router.get("/baskets")
async def get_baskets():
    """Get subject basket configuration."""
    return al_predictor_service.SUBJECT_BASKETS

@router.get("/streams")
async def get_streams():
    """Get list of available AL streams."""
    try:
        streams = al_predictor_service.get_available_streams()
        return {"streams": streams}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def predict_stream(marks: Dict[str, Any]):
    """
    Predict AL stream based on OL marks.
    Expects a dictionary because subject names can have spaces.
    """
    try:
        result = al_predictor_service.predict_stream(marks)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
