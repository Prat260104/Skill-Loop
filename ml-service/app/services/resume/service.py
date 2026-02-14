import spacy
import pdfplumber
import io
import json
import os
import re
from fastapi import UploadFile, HTTPException

# Load the Custom NER Model
try:
    # Try loading custom NER model first
    nlp = spacy.load("app/services/resume/models/custom_ner_model")
    print("✅ Custom NER model loaded successfully!")
    USE_CUSTOM_NER = True
except OSError:
    # Fallback to base model
    try:
        nlp = spacy.load("en_core_web_sm")
        print("⚠️ Custom NER model not found. Using base model.")
        USE_CUSTOM_NER = False
    except OSError:
        print("⚠️ No spaCy model found. Please run: python -m spacy download en_core_web_sm")
        nlp = None
        USE_CUSTOM_NER = False

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
        # Read file into memory
        file_bytes = await file.read()
        
        # Reset file pointer just in case
        await file.seek(0)
        
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text_content += extracted + "\n"
                    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF: {str(e)}")
    
    if not text_content.strip():
        # Fallback for scanned PDFs or empty files could go here
        raise HTTPException(status_code=400, detail="PDF is empty or unreadable.")
    
    return text_content

def find_nearest_org(job_role_entity, doc):
    """
    Finds the nearest ORG entity after a JOB_ROLE.
    Used to extract complete experience: 'Software Engineer at Google'
    
    Args:
        job_role_entity: The JOB_ROLE entity
        doc: spaCy Doc object
    
    Returns:
        str: Organization name or None
    """
    for ent in doc.ents:
        if ent.label_ == "ORG" and ent.start > job_role_entity.end:
            # Return first ORG found after the job role
            return ent.text
    return None

def is_valid_role(role: str) -> bool:
    """Refined check to see if a string is likely a valid job role."""
    role = role.strip()
    if len(role) < 3: return False
    
    # Common verbs/junk that NER might pick up
    invalid_roles = {
        "work", "worked", "working", "responsible", "involved", "participated", "contributed",
        "managing", "managed", "developing", "developed", "creating", "created",
        "using", "used", "utilized", "assist", "assisted", "handling", "handled",
        "team", "member", "project", "role", "task", "duties", 
        # New blocklist based on logs
        "mentoring", "mentor", "teaching", "fundamentals", "basics", "concepts", "models", "model",
        "institutions", "institution", "coordinator", "activities"
    }
    
    role_lower = role.lower()
    if role_lower in invalid_roles:
        return False
        
    # Block roles that start with a month (e.g., "Nov 2025")
    if re.match(r"^(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)", role_lower):
        return False
        
    # Block roles that look like years "2023" or "2023-2024"
    if re.match(r"^\d{4}", role): 
        return False

    return True

def is_valid_company(company: str) -> bool:
    """Refined check to see if a string is likely a valid company/org."""
    company = company.strip()
    if len(company) < 2: return False
    
    company_lower = company.lower()
    
    # Check for dates (Months, Years)
    months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", 
              "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec"]
    
    # If the company is JUST a month or year, reject it
    if company_lower in months: return False
    if re.match(r"^\d{4}$", company): return False # Year only
    if re.match(r"^(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}$", company_lower): return False # "Nov 2025"
    
    # Common false positives
    invalid_companies = {
        "present", "current", "various", "university", "college", "school", "institute", 
        "linkedin", "github", "gitlab", "twitter", "medium", "facebook", "instagram", "youtube", "project", "model"
    }
    
    if company_lower in invalid_companies:
        return False
        
    return True

def analyze_resume_text(text: str) -> dict:
    """Analyzes text using Custom NER Model or fallback to Keyword Matching"""
    if nlp is None:
        raise HTTPException(status_code=500, detail="AI Model not loaded")

    doc = nlp(text)
    
    extracted_data = {
        "name": None,
        "email": None,
        "skills": [],
        "experience": [],
        "summary": None,
        "raw_text_length": len(text),
        "extraction_method": "custom_ner" if USE_CUSTOM_NER else "regex_fallback"
    }

    # =========================================================================
    # 1. SEGMENTATION: Split Resume into Logical Blocks
    # =========================================================================
    
    sections = {
        "SUMMARY": "",
        "EXPERIENCE": "",
        "SKILLS": "",
        "EDUCATION": "", # Placeholder if needed later
        "PROJECTS": ""   # Placeholder
    }
    
    # Define Header Patterns
    # (?i) = case-insensitive
    # (?:[:\-]|\r?\n|$) = matches colon, dash, OR newline, OR end of string
    # Define Header Patterns
    # (?i) = case-insensitive
    # (?:[:\-]|\r?\n|$) = matches colon, dash, OR newline, OR end of string
    header_patterns = {
        "SUMMARY": r"(?:^|\n)\s*(?:Professional\s+|Career\s+|Exec(?:utive)?\s+)?(Summary|Objective|Profile|About\s+Me|Bio(?:graphy)?|Summary\s+of\s+Qualifications|Career\s+Highligts|Professional\s+Overview)\s*(?:[:\-]|\r?\n|$)",
        "EXPERIENCE": r"(?:^|\n)\s*(?:Professional\s+|Work\s+|Relevant\s+|Additional\s+|Industry\s+|Career\s+)?(Experience|Employment|Internships|Work\s+History|Experience\s+Summary|Career\s+History|Professional\s+Background)\s*(?:[:\-]|\r?\n|$)(?!\s*\d)",
        "SKILLS": r"(?:^|\n)\s*(?:Technical\s+|Professional\s+|Core\s+|Soft\s+|Hard\s+|Key\s+|Computer\s+|Software\s+|IT\s+)?(Skills|Technologies|Tech\s+Stack|Competencies|Languages\s+and\s+Technologies|Tool(?:s)?|Technical\s+Proficiency|Skills\s+&\s+Expertise|Technical\s+Set)\s*(?:[:\-]|\r?\n|$)",
        "EDUCATION": r"(?:^|\n)\s*(?:Academic\s+|Educational\s+)?(Education|Qualifications|Academic\s+History|Degrees|Academic\s+Background|Education\s+&\s+Credentials|Scholastic\s+Achievements)\s*(?:[:\-]|\r?\n|$)",
        "PROJECTS": r"(?:^|\n)\s*(?:Key\s+|Academic\s+|Personal\s+|Major\s+|Selected\s+|Capstone\s+)?(Projects|Portfolio|Project\s+Experience|Notable\s+Projects)\s*(?:[:\-]|\r?\n|$)",
        
        # Delimiters: Sections we don't extract but use to stop other sections
        "ACHIEVEMENTS": r"(?:^|\n)\s*(?:Key\s+|Scholastic\s+|Academic\s+)?(Achievements|Awards|Honors|Accomplishments|Co-curricular\s+Activities|Awards\s+&\s+Honors|Distinctions)\s*(?:[:\-]|\r?\n|$)",
        "CERTIFICATIONS": r"(?:^|\n)\s*(?:Professional\s+|Technical\s+)?(Certifications|Courses|Licenses|Training|Workshops|Credentials|Accreditations)\s*(?:[:\-]|\r?\n|$)",
        "LANGUAGES": r"(?:^|\n)\s*(?:Spoken\s+|Foreign\s+)?(Languages?|Language\s+Proficiency|Linguistic\s+Skills)\s*(?:[:\-]|\r?\n|$)",
        "HOBBIES": r"(?:^|\n)\s*(?:Personal\s+)?(Hobbies|Interests|Extracurricular(?:\s+Activities)?|Pastimes|Leisure)\s*(?:[:\-]|\r?\n|$)",
        "REFERENCES": r"(?:^|\n)\s*(?:Professional\s+)?(References|Referees)\s*(?:[:\-]|\r?\n|$)",
        "DECLARATION": r"(?:^|\n)\s*(?:Author'?s\s+)?(Declaration|Signature|Statement)\s*(?:[:\-]|\r?\n|$)",
        "PUBLICATIONS": r"(?:^|\n)\s*(?:Research\s+)?(Publications|Papers|Presentations|Conference\s+Proceedings|Research\s+Work)\s*(?:[:\-]|\r?\n|$)",
        "VOLUNTEER": r"(?:^|\n)\s*(?:Community\s+|Social\s+)?(Volunteer(?:\s+Experience|\s+Work)?|Community\s+Service|Pro\s+Bono)\s*(?:[:\-]|\r?\n|$)"
    }
    
    # Helper to find the start index of a section
    def find_section_start(text, pattern_name):
        match = re.search(header_patterns[pattern_name], text, re.IGNORECASE)
        return match.start() if match else -1

    # Find all section starts
    section_indices = []
    for name in header_patterns:
        idx = find_section_start(text, name)
        if idx != -1:
            section_indices.append((idx, name))
    
    # Sort by position in text
    section_indices.sort(key=lambda x: x[0])
    
    # Extract text between sections
    for i, (start_idx, name) in enumerate(section_indices):
        # Start header length (approximation to skip the header itself)
        # We re-match to get the exact end of the header
        match = re.search(header_patterns[name], text[start_idx:], re.IGNORECASE)
        content_start = start_idx + match.end()
        
        if i < len(section_indices) - 1:
            # End at the start of the next section
            content_end = section_indices[i+1][0]
        else:
            # Run until end of text
            content_end = len(text)
            
        sections[name] = text[content_start:content_end].strip()
        print(f"✅ FOUND Section [{name}]: {len(sections[name])} chars")

    # Fallback: If no Summary section found, try top of file heuristic
    if not sections["SUMMARY"]:
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if lines:
            # Take first few lines excluding Name/Contact
            summary_candidates = []
            for line in lines[:10]:
                if len(line.split()) > 3 and "@" not in line and "phone" not in line.lower():
                    summary_candidates.append(line)
                    if len(summary_candidates) >= 4: break
            sections["SUMMARY"] = " ".join(summary_candidates)
            print("⚠️ Using Top-of-File Heuristic for SUMMARY")

    # =========================================================================
    # 2. PROCESSING: Extract Data from Specific Sections
    # =========================================================================

    # --- Process SUMMARY ---
    raw_summary = sections["SUMMARY"]
    if "." in raw_summary:
        # Take first sentence or two
        extracted_data["summary"] = raw_summary.split(".")[0] + "."
    else:
        extracted_data["summary"] = raw_summary

    # --- Process EXPERIENCE ---
    target_exp_text = sections["EXPERIENCE"]
    if target_exp_text:
        # A. Regex Extraction (Specific to Experience Section)
        job_roles = r"(Intern|Engineer|Developer|Lead|Manager|Head|Coordinator|Volunteer|Member|Fellow|Specialist|Analyst|Consultant|Director|Founder|Co-Founder|Architect|Administrator|Associate|Researcher)"
        role_pattern = fr"(?i)\b({job_roles}[\w\s]*?)\s+(?:at|@)\s+([A-Z][\w\s&]+?)(?=\s+from|\s+in|\s*[\(\|]|\s*[\d]|$)"
        
        matches = re.findall(role_pattern, target_exp_text)
        for match in matches:
            if isinstance(match, tuple) and len(match) >= 2:
                role, company = match[0].strip(), match[1].strip()
                
                print(f"🧐 Regex Candidate: Role='{role}' | Company='{company}'")
                
                # Filter out false positives
                if not is_valid_role(role):
                    print(f"❌ REJECTED ROLE (Regex): '{role}'")
                    continue
                if not is_valid_company(company):
                    print(f"❌ REJECTED COMPANY (Regex): '{company}'")
                    continue
                    
                print(f"✅ ACCEPTED (Regex): {role} at {company}")
                extracted_data["experience"].append({"org": f"{role} at {company}", "type": "Experience (Regex)"})

        # B. NER Extraction (Specific to Experience Section)
        if USE_CUSTOM_NER:
            doc_exp = nlp(target_exp_text)
            ner_jobs = []
            for ent in doc_exp.ents:
                if ent.label_ == "JOB_ROLE":
                    print(f"🧐 NER Candidate Role: '{ent.text}'")
                    
                    # Validate the role itself
                    if not is_valid_role(ent.text):
                        print(f"❌ REJECTED ROLE (NER): '{ent.text}'")
                        continue
                        
                    # Find nearest ORG in this specific text block
                    org_text = find_nearest_org(ent, doc_exp)
                    print(f"   -> Associated ORG: '{org_text}'")
                    
                    if org_text:
                        if not is_valid_company(org_text):
                            print(f"   ❌ REJECTED COMPANY (NER): '{org_text}' - Falling back to role only")
                            job_entry = ent.text # Fallback to just role
                        else:
                            job_entry = f"{ent.text} at {org_text}"
                    else:
                        job_entry = ent.text
                    
                    # Deduplicate with Regex results
                    if job_entry not in [e['org'] for e in extracted_data['experience']]:
                        ner_jobs.append({"org": job_entry, "type": "Experience (NER)"})
            
            extracted_data["experience"].extend(ner_jobs)
    else:
        print("⚠️ Empty EXPERIENCE section. Skipping extraction.")

    # --- Process SKILLS ---
    target_skills_text = sections["SKILLS"]
    found_skills = set()
    
    if target_skills_text:
        # A. Rule-Based/Keyword Matching (Specific to Skills Section)
        doc_text_lower = target_skills_text.lower()
        for skill in SKILLS_DB:
            pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"
            if re.search(pattern, doc_text_lower):
                found_skills.add(skill.strip().title())
        
        # B. NER Extraction (Specific to Skills Section)
        if USE_CUSTOM_NER:
            doc_skills = nlp(target_skills_text)
            for ent in doc_skills.ents:
                if ent.label_ == "SKILL":
                    found_skills.add(ent.text.strip().title())
        
        print(f"✅ Found {len(found_skills)} skills in SKILLS section")
    else:
        print("⚠️ Empty SKILLS section. Strict mode active: returning 0 skills.")
        # If user wants strict mode, we DO NOT look elsewhere.
        
    extracted_data["skills"] = sorted(list(found_skills))

    # --- Extract Name (Always from top of full text) ---
    # We still use the full doc for Name because it's usually at the very top
    if USE_CUSTOM_NER:
         # Limit to first 200 chars for name search to save time/compute
        doc_top = nlp(text[:500])
        for ent in doc_top.ents:
            if ent.label_ == "PERSON":
                extracted_data["name"] = ent.text
                break
    
    return extracted_data
