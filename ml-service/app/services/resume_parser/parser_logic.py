import spacy
import pdfplumber
import io
import json
import os
import re
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
        "summary": None,
        "raw_text_length": len(text)
    }

    # 📝 Extract Summary (Smart Section-Aware)
    # Strategy:
    # 1. Look for headers like "Summary", "Professional Summary", "Objective".
    # 2. If found, grab text until next header.
    # 3. If NOT found, fallback to top-of-file heuristic (but deeper search).
    
    summary_header = r"(?:^|\n)\s*(?:Professional\s+|Career\s+|Executive\s+)?(Summary|Objective|Profile|About Me)\s*(?:[:\-]|$)"
    match = re.search(summary_header, text, re.IGNORECASE)
    
    if match:
        # Found a specific summary section!
        start_idx = match.end()
        remaining = text[start_idx:]
        
        # Stop at next common header (Experience, Education, Skills, etc.)
        next_header = r"(?:^|\n)\s*(?:Experience|Work|Employment|Education|Skills|Technical\s+Skills|Professional\s+Skills|Core\s+Competencies|Soft\s+Skills|Tools|Technologies|(?:[\w\s]+)?Projects|Certifications|Languages|Achievements|Awards|Honors|Publications|Volunteer|Hobbies|Interests|Freelance)\s*(?:[:\-]|\r?\n|$)"
        end_match = re.search(next_header, remaining, re.IGNORECASE)
        
        raw_summary = ""
        if end_match:
            raw_summary = remaining[:end_match.start()].strip()
        else:
            # Take a reasonable chunk if no next header found (e.g. first 500 chars)
            raw_summary = remaining[:500].strip()
            
        # Truncate at first full stop
        if "." in raw_summary:
            extracted_data["summary"] = raw_summary.split(".")[0] + "."
        else:
            extracted_data["summary"] = raw_summary
    else:
        # Fallback: Check first 15 lines (increased from 6)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if lines:
            summary_lines = []
            # Skip lines that usually appear at top (Name, Contact info)
            for line in lines[:15]: 
                # Heuristic: Line > 3 words, no '@' (email), no 'phone'
                if len(line.split()) > 3 and "@" not in line and "phone" not in line.lower():
                    summary_lines.append(line)
                    # Limit to ~5 lines for bio
                    if len(summary_lines) >= 5: break
            
            raw_summary = " ".join(summary_lines)
            if "." in raw_summary:
                extracted_data["summary"] = raw_summary.split(".")[0] + "."
            else:
                extracted_data["summary"] = raw_summary
        
    # 🕵️‍♂️ Improved Experience Extraction (Section-Aware)
    # 1. Identify "Experience" or "Work History" Section
    # 2. Extract only from that section until the next header
    
    experience_entries = []
    
    # Robust Regex for Section Headers
    # Matches lines like: "Professional Experience", "WORK HISTORY", "Employment", "Internships"
    # (?i) = case insensitive, (?:^|\n) = start of line, \s* = optional whitespace
    # STRICT: Removed isolated 'Work' and 'History' to avoid matching sentences like "Work on java".
    # STRICT: Removed isolated 'Work' and 'History'. Added negative lookahead (?!\s*\d) to avoid "Experience: 5 years".
    headers_pattern = r"(?:^|\n)\s*(?:Professional\s+|Work\s+|Relevant\s+|Additional\s+)?(Experience|Employment|Internships|Work\s+History)\s*(?:[:\-]|\r?\n|$)(?!\s*\d)"
    
    # We use re.split with capturing group to keep the delimiter to know which section we found
    sections = re.split(f"({headers_pattern})", text, flags=re.IGNORECASE)
    
    experience_text_block = ""
    
    # Find the block after our Experience header
    # re.split return [text_before, match_group1, text_after...]
    # Since our pattern has groups, the output structure is tricky. 
    # Let's simplify: find the index of the best match.
    
    search_match = re.search(headers_pattern, text, re.IGNORECASE)
    if search_match:
        start_index = search_match.end()
        # Look for the NEXT header after this one to determine the end
        remaining_text = text[start_index:]
        
        next_header_pattern = r"(?:^|\n)\s*(?:Education|Skills|Technical\s+Skills|Professional\s+Skills|Core\s+Competencies|Soft\s+Skills|Tools|Technologies|(?:[\w\s]+)?Projects|Certifications|Achievements|Languages|References|Declaration|Awards|Honors|Publications|Volunteer|Hobbies|Interests|Freelance)\s*(?:[:\-]|\r?\n|$)"
        end_match = re.search(next_header_pattern, remaining_text, re.IGNORECASE)
        
        if end_match:
            experience_text_block = remaining_text[:end_match.start()]
        else:
            experience_text_block = remaining_text # Go to end of file if no other headers
            
        print(f"✅ FOUND Section: '{search_match.group().strip()}'")
    else:
        print("⚠️ NO Experience Header Found. Skipping regex extraction to avoid false positives.")
        experience_text_block = "" # Do NOT use full text to avoid bleeding


    target_text = experience_text_block
    
    # Common Job Roles to look for (Added more)
    job_roles = r"(Intern|Engineer|Developer|Lead|Manager|Head|Coordinator|Volunteer|Member|Fellow|Specialist|Analyst|Consultant|Director|Founder|Co-Founder|Architect|Administrator|Associate|Researcher)"
    
    # Pattern: "Role at Company" (e.g., "Software Engineer at Google", "Technical Lead at GDSC")
    # STRICT: Removed 'for' and 'with' to prevent "Responsible for Project" matches.
    role_at_company_pattern = fr"(?i)\b({job_roles}[\w\s]*?)\s+(?:at|@)\s+([A-Z][\w\s&]+?)(?=\s+from|\s+in|\s*[\(\|]|\s*[\d]|$)"
    
    matches = re.findall(role_at_company_pattern, target_text)
    for role, company in matches:
        # Clean up
        role = role.strip()
        company = company.strip()
        
        # Filter out common false positives
        if len(company) < 2 or company.lower() in ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "present", "various", "university", "college", "school", "institute", "linkedin", "github", "gitlab", "twitter", "medium", "facebook", "instagram", "youtube"]:
            continue
            
        full_entry = f"{role} at {company}"
        if full_entry not in [e['org'] for e in extracted_data['experience']]:
            extracted_data["experience"].append({"org": full_entry, "type": "Experience (Regex)"})

    # Fallback removed to enforce strict section-based extraction.
    # If no Experience section is found, we return no experience rather than guessing from full text.

    # NER Name Extraction (Keep this)
    for ent in doc.ents:
        if ent.label_ == "PERSON" and extracted_data["name"] is None:
            extracted_data["name"] = ent.text

    # Skill Matching
    doc_text_lower = text.lower()
    found_skills = set()
    
    # We use regex with word boundaries (\b) to ensure we match "Java" but not "Javascript" (if looking for "Script") 
    # or "C" in "Cloud".
    
    for skill in SKILLS_DB:
        # Create a regex pattern for the skill, ensuring it matches whole words only
        # re.escape is used to handle special characters like C++ or C#
        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"
        
        if re.search(pattern, doc_text_lower):
            found_skills.add(skill.title())
            
    extracted_data["skills"] = list(found_skills)
    
    return extracted_data
