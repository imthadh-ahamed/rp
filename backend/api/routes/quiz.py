import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
from core.services import quiz_rag_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/quiz", tags=["Quiz"])

class QuizRequest(BaseModel):
    stream: str
    num_questions: int = 10

class QuizSubmission(BaseModel):
    answers: List[str]
    correct_answers: List[str]

@router.on_event("startup")
async def startup_event():
    # Initialize RAG service on startup
    quiz_rag_service.init_rag_service()

@router.get("/streams")
async def get_streams():
    """Get available subject streams"""
    try:
        return quiz_rag_service.get_stream_details()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stream-info/{stream}")
async def get_stream_info(stream: str):
    """Get information about a specific stream"""
    try:
        info = quiz_rag_service.get_stream_info(stream)
        if not info:
            raise HTTPException(status_code=404, detail=f"Stream '{stream}' not found")
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
async def generate_quiz(request: QuizRequest):
    """Generate MCQ quiz for selected stream"""
    if request.num_questions < 1 or request.num_questions > 20:
        raise HTTPException(status_code=400, detail="Number of questions must be between 1 and 20")
    
    # Normalize stream name to match database
    stream_mapping = {
        'arts': 'art',
        'biological science': 'biological_science',
        'physical science': 'physical_science',
    }
    
    normalized_stream = request.stream.lower().strip()
    normalized_stream = stream_mapping.get(normalized_stream, normalized_stream)
    
    try:
        mcqs = quiz_rag_service.generate_mcqs_for_stream(
            stream=normalized_stream,
            questions_per_stream=request.num_questions
        )
        
        quiz_questions = []
        correct_answers = []
        
        for i, q in enumerate(mcqs):
            quiz_questions.append({
                "id": i + 1,
                "question": q["question"],
                "options": q["options"],
                "question_type": q.get("question_type", "unknown")
            })
            correct_answers.append(q["correct_answer"])
            
        return {
            "stream": request.stream,
            "questions": quiz_questions,
            "answers": correct_answers
        }
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in generate_quiz: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")

@router.post("/submit")
async def submit_quiz(submission: QuizSubmission):
    """Score the quiz submission"""
    if len(submission.answers) != len(submission.correct_answers):
        raise HTTPException(status_code=400, detail="Answer count mismatch")
        
    try:
        score = 0
        results = []
        
        for i, (user_ans, correct_ans) in enumerate(zip(submission.answers, submission.correct_answers)):
            is_correct = user_ans.upper() == correct_ans.upper()
            if is_correct:
                score += 1
            
            results.append({
                "question_no": i + 1,
                "user_answer": user_ans,
                "correct_answer": correct_ans,
                "is_correct": is_correct
            })
        
        percentage = round((score / len(submission.correct_answers)) * 100, 2)
        
        return {
            "score": score,
            "total": len(submission.correct_answers),
            "percentage": percentage,
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
