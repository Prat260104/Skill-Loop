
import sys
import os
import re
import spacy

# Mock the environment to load the service logic
sys.path.append(os.getcwd())

from app.services.resume.service import analyze_resume_text

# The text from the user's resume screenshot
resume_text = """
Prateek Rai
Ghaziabad, India | Phone: +91 9695056386 | Email: prateekrai903@gmail.com

Professional Summary
Machine Learning-focused engineer...

Technical Skills
Machine Learning: Supervised and Unsupervised Learning...

Experience
Technical Lead
NextGen Supercomputing Club, KIET Group of Institutions, Ghaziabad     Nov 2025 - Present

• Mentoring students on ML fundamentals...
• Designing backend services...

Student Internship Coordinator
KIET Group of Institutions                        Jan 2025 - Present

• Coordinated technical internship programs...
"""

print("--- Running Analysis ---")
result = analyze_resume_text(resume_text)

print("\n--- Extracted Experience ---")
for exp in result['experience']:
    print(exp)
