from fastapi import APIRouter, UploadFile, File, HTTPException, Form, BackgroundTasks
from app.services.resume import extract_text_from_pdf, analyze_resume_text
from app.services.rag.service import ingest_document

router = APIRouter()

@router.post("/parse")
async def parse_resume_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_id: str = Form(...)  # Expect user_id as a form field
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # 1. Extract
    text = await extract_text_from_pdf(file)
    
    # 2. Ingest into RAG System (Run in Background to prevent Timeout)
    # The user doesn't need to wait for embeddings to be generated.
    background_tasks.add_task(ingest_document, text, user_id)

    # 3. Analyze (Standard Parsing)
    # This is fast and required immediately for the UI.
    result = analyze_resume_text(text)
    
    return result
