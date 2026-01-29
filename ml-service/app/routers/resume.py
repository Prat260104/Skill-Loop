from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_parser.parser_logic import extract_text_from_pdf, analyze_resume_text

router = APIRouter()

@router.post("/parse")
async def parse_resume_endpoint(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # 1. Extract
    text = await extract_text_from_pdf(file)
    
    # 2. Analyze
    result = analyze_resume_text(text)
    
    return result
