import requests
import google.generativeai as genai
import os
from dotenv import load_dotenv

#Load environment variables
load_dotenv()
# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_github_profile(username: str):
    """
    Analyzes a GitHub profile using a Hybrid Approach:
    1. GitHub API: Fetches hard data (Languages, Star counts)
    2. Gemini AI: Analyzes READMEs/Descriptions for qualitative insights (Tech stack, Seniority)
    """
    try:
        # 1. FETCH REPOS (Hard Data)
        # Sort by updated to get recent active work, or stars for popularity.
        # Let's go with updated to see current skills. Actually design said stars. 
        # Let's stick to stars to find "Best Work".
        url = f"https://api.github.com/users/{username}/repos?sort=stars&per_page=5"
        response = requests.get(url)
        
        if response.status_code != 200:
            return {"error": "GitHub User not found or API limit reached"}
            
        repos = response.json()
        
        technical_skills = set()
        project_descriptions = []
        
        for repo in repos:
            # A. Collect Languages
            if repo.get('language'):
                technical_skills.add(repo['language'])
                
            # B. Get Project Context (Readme or Description)
            # We try to fetch the README raw content
            readme_url = f"https://raw.githubusercontent.com/{username}/{repo['name']}/main/README.md"
            readme_response = requests.get(readme_url)
            
            project_context = ""
            if readme_response.status_code == 200:
                # Limit to first 2000 chars to save tokens but get enough context
                project_context = f"Readme Snippet: {readme_response.text[:2000]}"
            else:
                # Smart Fallback: Use Description + Language if Readme is missing
                desc = repo.get('description') or "No description provided"
                lang = repo.get('language') or "Unknown"
                project_context = f"Description: {desc}\nPrimary Language: {lang}"
                
            project_descriptions.append(f"Project Name: {repo['name']}\nStars: {repo['stargazers_count']}\n{project_context}\n---")

        # 2. AI ANALYSIS (The Brain)
        # We feed the collected context to Gemini
        # Switched to flash-latest for better quota stability
        print(f"DEBUG: Using model models/gemini-flash-latest")
        model = genai.GenerativeModel('models/gemini-flash-latest')
        
        prompt = f"""
        You are a Technical Recruiter and Senior Engineer. Analyze these {len(project_descriptions)} GitHub projects to build a candidate profile.
        
        Projects Data:
        {chr(10).join(project_descriptions)}
        
        Task:
        1. Identify the **implied tech stack** (libraries/frameworks not explicitly listed like React, FastAPI, TensorFlow).
        2. Estimate the **seniority level** (Beginner, Intermediate, Advanced) based on project complexity.
        3. Highlight 2-3 **key strengths**.
        
        Output Format (JSON):
        {{
            "frameworks": ["Django", "React"],
            "seniority": "Intermediate",
            "strengths": ["API Design", "Data Visualization"],
            "summary": "A brief 2-line professional summary of their coding style."
        }}
        """
        
        result = model.generate_content(prompt)
        
        return {
            "username": username,
            "verified_languages": list(technical_skills),
            "top_projects_count": len(repos),
            "ai_analysis": result.text  # This will be a JSON string from Gemini
        }

    except Exception as e:
        return {"error": str(e)}
