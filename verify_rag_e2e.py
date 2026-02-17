import requests
import time
import os
from fpdf import FPDF

# Configuration
BACKEND_URL = "http://localhost:9090/api"
ML_SERVICE_URL = "http://localhost:8001/api/v1"

def create_dummy_resume(filename="test_resume.pdf"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Prateek Rai", ln=1, align="C")
    pdf.cell(200, 10, txt="Software Engineer - Java, Spring Boot, React", ln=2, align="C")
    pdf.cell(200, 10, txt="Experience: 3 years at TechCorp building scalable microservices.", ln=3, align="L")
    pdf.cell(200, 10, txt="Skills: Java, Python, Machine Learning, Docker, Kubernetes.", ln=4, align="L")
    pdf.output(filename)
    print(f"📄 Created dummy resume: {filename}")
    return filename

def get_first_user_id():
    try:
        response = requests.get(f"{BACKEND_URL}/user")
        if response.status_code == 200:
            users = response.json()
            if users:
                user_id = users[0]['id']
                print(f"👤 Found User ID: {user_id}")
                return user_id
            else:
                print("❌ No users found in database.")
                return None
        else:
            print(f"❌ Failed to fetch users: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Backend connection failed: {e}")
        return None

def verify_rag_flow():
    user_id = get_first_user_id()
    if not user_id:
        return

    # 1. Upload Resume (Triggers Ingestion)
    resume_file = create_dummy_resume()
    files = {'file': open(resume_file, 'rb')}
    
    print(f"\n📤 Uploading Resume for User {user_id}...")
    try:
        response = requests.post(f"{BACKEND_URL}/user/{user_id}/resume", files=files)
        if response.status_code == 200:
            print("✅ Resume Uploaded Successfully!")
            print(f"   Parsed Data: {response.json().get('skills', [])}")
        else:
            print(f"❌ Upload Failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ Upload Error: {e}")
        return

    # Allow time for background ingestion
    print("⏳ Waiting 5 seconds for Vector DB Ingestion...")
    time.sleep(5)

    # 2. Generate Question (Triggers Retrieval)
    print(f"\n🤖 Generating Interview Question for 'Java'...")
    question_payload = {
        "skill": "Java",
        "difficulty": "Medium",
        "userId": user_id
    }
    
    try:
        # Hitting Verification Controller (Backend Proxy)
        response = requests.post(f"{BACKEND_URL}/verification/generate", json=question_payload)
        if response.status_code == 200:
            q_data = response.json()
            print(f"✅ Question Generated: {q_data.get('question')}")
            question_text = q_data.get('question')
        else:
            print(f"❌ Generation Failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ Generation Error: {e}")
        return

    # 3. Evaluate Answer (Triggers LLM Evaluation)
    print(f"\n📝 Submitting Answer...")
    answer_payload = {
        "question": question_text,
        "userAnswer": "Java uses garbage collection to manage memory automatically. It runs on the JVM which makes it platform independent.",
        "userId": user_id,
        "skill": "Java"
    }

    try:
        response = requests.post(f"{BACKEND_URL}/verification/evaluate", json=answer_payload)
        if response.status_code == 200:
            eval_data = response.json()
            print(f"✅ Evaluation Result: Score {eval_data.get('score')}/100")
            print(f"   Feedback: {eval_data.get('feedback')}")
            print(f"   Verified: {eval_data.get('is_verified')}")
        else:
            print(f"❌ Evaluation Failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ Evaluation Error: {e}")
        return

    print("\n🎉 RAG Pipeline Verification Complete!")

if __name__ == "__main__":
    verify_rag_flow()
