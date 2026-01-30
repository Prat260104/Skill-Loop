import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Load API Key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    # Use the 'gemini-pro' model (free tier compatible)
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None
    print("⚠️ WARNING: GEMINI_API_KEY not found in .env")

class GeminiInterviewer:
    
    @staticmethod
    def generate_question(skill: str, difficulty: str = "Medium"):
        if not model:
            return {"error": "API Key Missing"}

        prompt = f"""
        You are a Senior Technical Interviewer. 
        Generate 1 {difficulty} interview question for a candidate claiming expertise in '{skill}'.
        
        Rules:
        1. The question must be conceptual and require deep understanding (not just syntax).
        2. Provide the output in strict JSON format.
        3. Do NOT include markdown formatting (like ```json), just the raw JSON.
        
        JSON Structure:
        {{
            "question": "The actual question text",
            "topic": "The specific sub-topic (e.g., Memory Management)",
            "difficulty": "{difficulty}"
        }}
        """
        
        try:
            response = model.generate_content(prompt)
            # Clean up potential markdown code blocks
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except Exception as e:
            return {"error": str(e), "fallback": True}

    @staticmethod
    def evaluate_answer(question: str, user_answer: str):
        if not model:
            return {"error": "API Key Missing"}

        prompt = f"""
        Act as a Strict Technical Lead.
        
        Question: "{question}"
        Candidate's Answer: "{user_answer}"
        
        Evaluate this answer. 
        Return ONLY valid JSON.
        
        JSON Structure:
        {{
            "score": (integer 0-100),
            "feedback": "1-2 sentences explaining why the score was given.",
            "is_verified": (boolean, true if score >= 70)
        }}
        """
        
        try:
            response = model.generate_content(prompt)
             # Clean up potential markdown code blocks
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except Exception as e:
            return {"error": str(e)}
