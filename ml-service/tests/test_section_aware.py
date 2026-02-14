import requests
import json
import os

def test_section_aware():
    url = "http://localhost:8001/api/v1/resume/parse"
    
    # Create a PDF where "Java" is in Summary but NOT in Skills
    # And "Python" is in Skills
    # If our logic works, only "Python" should be extracted.
    
    # We cheat a bit and just put text. 
    # PDF generation in python is verbose, so we put raw strings.
    # The pdfplumber will read it if we structure it right or we trust the text structure.
    # Actually, let's just make a rigorous text structure in a PDF.
    
    pdf_content = (
        b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n"
        b"2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n"
        b"3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n"
        b"/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n"
        b"4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/Name /F1\n/BaseFont /Helvetica\n>>\nendobj\n"
        b"5 0 obj\n<<\n/Length 200\n>>\nstream\n"
        b"BT\n/F1 12 Tf\n100 700 Td\n(SUMMARY) Tj\n0 -20 Td\n(I love drinking Java coffee while coding.) Tj\n" # "Java" here should be IGNORED
        b"0 -40 Td\n(EXPERIENCE) Tj\n0 -20 Td\n(Software Engineer at Google) Tj\n"
        b"0 -40 Td\n(SKILLS) Tj\n0 -20 Td\n(Python, Docker, Kubernetes) Tj\n" # "Python" here should be KEPT
        b"ET\nendstream\nendobj\n"
        b"xref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\n0000000224 00000 n\n0000000312 00000 n\n"
        b"trailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n406\n%%EOF"
    )

    files = {'file': ('test_strict.pdf', pdf_content, 'application/pdf')}
    data = {'user_id': 'strict_test_user'}
    
    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, files=files, data=data) 
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            res = response.json()
            print("Skills Found:", res.get("skills"))
            print("Experience Found:", res.get("experience"))
            
            skills = res.get("skills", [])
            if "Python" in skills and "Java" not in skills:
                print("✅ PASSED: 'Java' in summary was ignored, 'Python' in skills was found.")
            else:
                print("❌ FAILED: Strict extraction logic not working as expected.")
                
        else:
            print(f"Failed: {response.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_section_aware()
