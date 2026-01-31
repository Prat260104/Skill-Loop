import sys
import os

# Add the app directory to sys.path so we can import modules
sys.path.append(os.path.join(os.path.dirname(__file__), "app"))

from app.services.resume_parser.parser_logic import analyze_resume_text

def test_duplicates():
    # A text with "Java" multiple times and conflicting overlapping skills if any
    text = """
    Prateek Rai
    Software Engineer
    
    Skills: Java, Python, C++, Java, Core Java, Java 8.
    Experience:
    Worked on Java projects using Java.
    """
    
    print("Analyzing text...")
    result = analyze_resume_text(text)
    
    skills = result["skills"]
    print(f"Extracted Skills: {skills}")
    
    # Check for duplicates
    if len(skills) != len(set(skills)):
        print("❌ FAILED: Duplicates found in skills list!")
        from collections import Counter
        print(f"Counts: {Counter(skills)}")
    else:
        print("✅ PASSED: No duplicates found.")

if __name__ == "__main__":
    test_duplicates()
