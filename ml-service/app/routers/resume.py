from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume import extract_text_from_pdf, analyze_resume_text
from app.services.rag.service import ingest_document
from fastapi import Form

router = APIRouter()

@router.post("/parse")
async def parse_resume_endpoint(
    file: UploadFile = File(...),
    user_id: str = Form(...)  # Expect user_id as a form field
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # 1. Extract
    text = await extract_text_from_pdf(file)
    
    # 2. Ingest into RAG System
    ingest_document(text, user_id)

    # 3. Analyze (Standard Parsing)
    result = analyze_resume_text(text)
    
    return result
