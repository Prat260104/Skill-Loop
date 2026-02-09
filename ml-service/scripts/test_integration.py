"""
Test Custom NER Model Integration
===================================
Quick test to verify the custom NER model works correctly.
"""

import sys
sys.path.append("app")

from services.resume_parser.parser_logic import analyze_resume_text

# Test cases
test_resumes = [
    """
    John Doe
    Email: john@example.com
    
    Professional Summary:
    Experienced software developer with expertise in modern web technologies.
    
    Technical Skills:
    Python, Django, React, Node.js, Docker, AWS, MongoDB
    
    Professional Experience:
    Software Engineer at Google India
    - Built scalable microservices
    - Worked with Kubernetes and Docker
    
    Full Stack Developer at Microsoft
    - Developed React applications
    - Used AWS Lambda for serverless functions
    """,
    
    """
    Jane Smith
    jane.smith@email.com
    
    Summary:
    Data scientist passionate about machine learning and AI.
    
    Skills:
    Machine Learning, TensorFlow, PyTorch, Python, Pandas, NumPy
    
    Work Experience:
    Data Scientist at OpenAI
    ML Engineer at Meta AI
    Research Intern at IBM Research
    """
]

print("=" * 70)
print(" Testing Custom NER Model Integration")
print("=" * 70)

for i, resume_text in enumerate(test_resumes, 1):
    print(f"\n{'='*70}")
    print(f" Test Case {i}")
    print(f"{'='*70}\n")
    
    result = analyze_resume_text(resume_text)
    
    print(f"📛 Name: {result['name']}")
    print(f"📧 Email: {result['email']}")
    print(f"🔧 Extraction Method: {result['extraction_method']}")
    print(f"\n💼 Skills ({len(result['skills'])}):")
    for skill in result['skills'][:10]:  # Show first 10
        print(f"   • {skill}")
    if len(result['skills']) > 10:
        print(f"   ... and {len(result['skills']) - 10} more")
    
    print(f"\n🏢 Experience ({len(result['experience'])}):")
    for exp in result['experience']:
        print(f"   • {exp['org']} [{exp['type']}]")
    
    print(f"\n📝 Summary: {result['summary'][:100] if result['summary'] else 'None'}...")

print(f"\n{'='*70}")
print(" ✅ Test Complete!")
print(f"{'='*70}\n")
