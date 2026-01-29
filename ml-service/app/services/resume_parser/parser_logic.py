import spacy
import pdfplumber
import io
import json
import os
from fastapi import UploadFile, HTTPException

# Load the AI Brain (spaCy Model)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("⚠️ Model not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

# Load Skills Database
SKILLS_DB = []
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, "data", "skills.json")
    
    with open(json_path, "r") as f:
        data = json.load(f)
        for category in data:
            SKILLS_DB.extend(data[category])
    print(f"✅ Loaded {len(SKILLS_DB)} skills from {json_path}")
except FileNotFoundError:
    print("⚠️ skills.json not found! Using empty DB.")

async def extract_text_from_pdf(file: UploadFile) -> str:
    """Reads PDF and returns raw text string."""
    text_content = ""
    try:
        file_bytes = await file.read()
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text_content += page.extract_text() + "\n"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF: {str(e)}")
    
    if not text_content.strip():
        raise HTTPException(status_code=400, detail="PDF is empty or unreadable.")
    
    return text_content

def analyze_resume_text(text: str) -> dict:
    """Analyzes text using spaCy and Keyword Matching"""
    if nlp is None:
        raise HTTPException(status_code=500, detail="AI Model not loaded")

    doc = nlp(text)
    
    extracted_data = {
        "name": None,
        "email": None, 
        "skills": [],
        "experience": [],
        "raw_text_length": len(text)
    }

    # NER for Org, Person
    for ent in doc.ents:
        if ent.label_ == "ORG" and ent.text not in [e['org'] for e in extracted_data['experience']]:
            extracted_data["experience"].append({"org": ent.text, "type": "Organization"})
        elif ent.label_ == "PERSON" and extracted_data["name"] is None:
            extracted_data["name"] = ent.text

    # Skill Matching
    doc_text_lower = text.lower()
    found_skills = set()
    for skill in SKILLS_DB:
        if skill in doc_text_lower:
            found_skills.add(skill.title())
            
    extracted_data["skills"] = list(found_skills)
    
    return extracted_data
