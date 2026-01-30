from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_interviewer import GeminiInterviewer

router = APIRouter()

class QuestionRequest(BaseModel):
    skill: str
    difficulty: str = "Medium"

class AnswerRequest(BaseModel):
    question: str
    user_answer: str

@router.post("/generate")
def generate_question(request: QuestionRequest):
    result = GeminiInterviewer.generate_question(request.skill, request.difficulty)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@router.post("/evaluate")
def evaluate_answer(request: AnswerRequest):
    result = GeminiInterviewer.evaluate_answer(request.question, request.user_answer)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
