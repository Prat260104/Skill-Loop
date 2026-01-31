import json
import os

def check_db():
    json_path = "app/services/resume_parser/data/skills.json"
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    all_skills = []
    for cat, skills in data.items():
        all_skills.extend(skills)
        
    print(f"Total entries: {len(all_skills)}")
    
    # Check for exact duplicates
    if len(all_skills) != len(set(all_skills)):
        print("❌ EXACT DUPLICATES FOUND IN DB!")
        seen = set()
        for x in all_skills:
            if x in seen:
                print(f"Duplicate: '{x}'")
            seen.add(x)
            
    # Check for case/strip duplicates
    normalized = [s.strip().lower() for s in all_skills]
    if len(normalized) != len(set(normalized)):
        print("❌ NORMALIZED DUPLICATES FOUND!")
        seen = set()
        duplicates = []
        for i, x in enumerate(normalized):
            if x in seen:
                duplicates.append(all_skills[i])
            seen.add(x)
        print(f"Duplicates (Normalized): {duplicates}")
    else:
        print("✅ No duplicates in DB.")

if __name__ == "__main__":
    check_db()
