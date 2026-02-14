from app.services.rag_service import ingest_document, get_interview_question, evaluate_answer
import os
from dotenv import load_dotenv

# Load env to sure API key is available
load_dotenv()

def test_rag_flow():
    user_id = "test_user_123"
    
    print("\n--- 1. Testing Ingestion ---")
    mock_resume_text = """
    EXPERIENCE
    Software Engineer at TechCorp
    - Built a recomendation engine using Python and TensorFlow.
    - Optimized SQL queries reducing latency by 40%.
    
    SKILLS
    Python, SQL, Machine Learning, Docker, Kubernetes.
    """
    ingest_result = ingest_document(mock_resume_text, user_id)
    print(f"Ingestion Result: {ingest_result}")
    
    print("\n--- 2. Testing Question Generation ---")
    # Ask about something in the resume
    question_json = get_interview_question("Machine Learning", user_id)
    print(f"Generated Question (JSON): {question_json}")
    
    # Ask about something NOT in the resume (fallback/general)
    question_json_2 = get_interview_question("Golang", user_id)
    print(f"Generated Question - Unknown Topic (JSON): {question_json_2}")

    print("\n--- 3. Testing Answer Evaluation ---")
    question_text = question_json.get("question", "What is ML?")
    user_answer = "It is a subset of AI that focuses on building systems that learn from data."
    
    eval_result = evaluate_answer(question_text, user_answer)
    print(f"Evaluation Result (JSON): {eval_result}")

if __name__ == "__main__":
    if not os.getenv("GEMINI_API_KEY"):
        print("❌ CRITICAL: GEMINI_API_KEY not found in environment!")
    else:
        try:
            test_rag_flow()
            print("\n✅ RAG Flow Verified Successfully")
        except Exception as e:
            print(f"\n❌ RAG Flow Failed: {e}")
