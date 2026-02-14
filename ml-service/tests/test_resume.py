import requests
import json
import os

def test_resume_parser():
    url = "http://localhost:8001/api/v1/resume/parse"
    # Create a dummy PDF file for testing
    with open("dummy_resume.pdf", "wb") as f:
        f.write(b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/Name /F1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 100 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\n0000000224 00000 n\n0000000312 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n406\n%%EOF")

    files = {'file': open('dummy_resume.pdf', 'rb')}
    data = {'user_id': 'test_user_456'}
    
    try:
        print(f"Sending request to {url} with file and user_id")
        response = requests.post(url, files=files, data=data)
        
        print(f"Status Code: {response.status_code}")
        try:
            print("Response JSON:")
            print(json.dumps(response.json(), indent=2))
        except:
            print("Response Text:")
            print(response.text)
            
    except Exception as e:
        print(f"Request failed: {e}")
    finally:
        os.remove("dummy_resume.pdf")

if __name__ == "__main__":
    test_resume_parser()
