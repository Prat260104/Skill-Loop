from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Union
from app.services.rag.service import get_interview_question, evaluate_answer

router = APIRouter()

class QuestionRequest(BaseModel):
    skill: str
    difficulty: str = "Medium"
    user_id: Union[str, int]  # Accept both string and int from different services

class AnswerRequest(BaseModel):
    question: str
    user_answer: str
    
    class Config:
        # Allow both userAnswer (from Java) and user_answer (Python convention)
        populate_by_name = True
        
    # Accept both field names
    @classmethod
    def __init_subclass__(cls):
        super().__init_subclass__()
    
    def __init__(self, **data):
        # Convert userAnswer to user_answer if present
        if 'userAnswer' in data and 'user_answer' not in data:
            data['user_answer'] = data.pop('userAnswer')
        super().__init__(**data)

@router.post("/generate")
def generate_question(request: QuestionRequest):
    # Use RAG service with user_id context
    result = get_interview_question(request.skill, str(request.user_id))
    
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
