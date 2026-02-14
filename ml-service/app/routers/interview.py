from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag.service import get_interview_question, evaluate_answer

router = APIRouter()

class QuestionRequest(BaseModel):
    skill: str
    difficulty: str = "Medium"
    user_id: str  # Required for RAG context

class AnswerRequest(BaseModel):
    question: str
    user_answer: str

@router.post("/generate")
def generate_question(request: QuestionRequest):
    # Use RAG service with user_id context
    result = get_interview_question(request.skill, request.user_id)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@router.post("/evaluate")
def evaluate_answer_endpoint(request: AnswerRequest):
    # Use RAG service (which wraps the evaluation prompt)
    result = evaluate_answer(request.question, request.user_answer)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
