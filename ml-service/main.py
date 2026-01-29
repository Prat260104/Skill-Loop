from fastapi import FastAPI, UploadFile, File, HTTPException
import spacy
import pdfplumber
import io
from typing import List, Dict

import json
import os

# Initialize FastAPI
app = FastAPI()

# Load the AI Brain (spaCy Model)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("⚠️ Model not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

# 🧠 Load Skills Database from JSON
SKILLS_DB = []
try:
    with open("skills.json", "r") as f:
        data = json.load(f)
        # Flatten the dictionary into a single list of skills
        for category in data:
            SKILLS_DB.extend(data[category])
    print(f"✅ Loaded {len(SKILLS_DB)} skills from skills.json")
except FileNotFoundError:
    print("⚠️ skills.json not found! Using empty DB.")
    SKILLS_DB = []

@app.get("/")
def home():
    return {
        "status": "active", 
        "message": "SkillLoop AI Resume Parser is Ready 🚀",
        "brain_loaded": nlp is not None
    }

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Accepts a PDF file, reads it, extracting skills and entities.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed currently.")

    # 1. READ THE PDF (The Eyes 👀)
    text_content = ""
    try:
        # Read file into memory
        file_bytes = await file.read()
        
        # open with pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text_content += page.extract_text() + "\n"
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF: {str(e)}")

    if not text_content.strip():
        raise HTTPException(status_code=400, detail="PDF is empty or unreadable.")

    # 2. PROCESS WITH AI (The Brain 🧠)
    if nlp is None:
        return {"error": "AI Model not loaded", "raw_text_preview": text_content[:200]}

    doc = nlp(text_content)
    
    # 3. EXTRACT ENTITIES (Date, Org, Person)
    extracted_data = {
        "name": None,
        "email": None, # Regex would be better for email, keeping simple for now
        "skills": [],
        "experience": [],
        "raw_text_length": len(text_content)
    }

    # Retrieve Entities (ORG, DATE, PERSON, GPE)
    # We filter purely by label for now.
    for ent in doc.ents:
        if ent.label_ == "ORG" and ent.text not in [e['org'] for e in extracted_data['experience']]:
            extracted_data["experience"].append({"org": ent.text, "type": "Organization"})
        elif ent.label_ == "PERSON" and extracted_data["name"] is None:
            # First person found is likely the candidate (Heuristic)
            extracted_data["name"] = ent.text

    # 4. SKILL MATCHING (Rule Based) 🔎
    # Tokenize and match against our database
    # We lower() the text to make it case-insensitive
    doc_text_lower = text_content.lower()
    
    found_skills = set()
    for skill in SKILLS_DB:
        if skill in doc_text_lower:
            found_skills.add(skill.title()) # Capitalize for nice display (java -> Java)
            
    extracted_data["skills"] = list(found_skills)

    return extracted_data
