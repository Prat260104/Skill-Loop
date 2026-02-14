import requests
import time
import os

def test_timeout():
    url = "http://localhost:8001/api/v1/resume/parse"
    
    # Create a simple valid PDF using raw bytes (same as test_resume.py)
    pdf_content = (
        b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n"
        b"2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n"
        b"3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n"
        b"/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n"
        b"4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/Name /F1\n/BaseFont /Helvetica\n>>\nendobj\n"
        b"5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 100 Td\n(Hello World Resume Test) Tj\nET\nendstream\nendobj\n"
        b"xref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\n0000000224 00000 n\n0000000312 00000 n\n"
        b"trailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n406\n%%EOF"
    ) 
    
    files = {'file': ('test.pdf', pdf_content, 'application/pdf')}
    data = {'user_id': 'timeout_test_user'}
    
    print(f"Sending request to {url}...")
    start_time = time.time()
    
    try:
        response = requests.post(url, files=files, data=data, timeout=30) # 30s timeout for client
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"Status Code: {response.status_code}")
        print(f"Duration: {duration:.2f} seconds")
        
        if response.status_code == 200:
            print("Success!")
        else:
            print(f"Failed: {response.text}")
            
    except requests.exceptions.Timeout:
        print("Request timed out after 30 seconds!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_timeout()
