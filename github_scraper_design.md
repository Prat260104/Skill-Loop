# 🐙 GitHub Scraper: The "Hybrid Intelligence" Architecture (Production Grade)

To impress an interviewer and build a scalable system, we use a **Hybrid Approach**:
**Structured Data (API)** + **Unstructured Context (LLM)**.

---

## 🏗️ 1. Architecture Overview (The "Best" Way)

We don't just "scrape" HTML (which breaks easily). We use the **Official GitHub API** for reliability and **Gemini AI** for intelligence.

### **Phase A: The Data Pipeline (Fast & Reliable)**
*   **Source:** GitHub REST API (`https://api.github.com/users/{username}/repos`).
*   **Why:** It gives us clean JSON: Language breakdown, Star count, Fork count.
*   **Result:** Hard numbers. "User has 10 Python repos, 2 Java repos."

### **Phase B: The Intelligence Layer (The "Wow" Factor)** 🧠
*   **Source:** `README.md` files of the user's **Top 3 Starred Repos**.
*   **Tool:** Gemini 1.5 Flash (via `google-generativeai`).
*   **Why:** A repo marked "Python" could be a "Hello World" or a "Complex AI Agent". Only reading the Readme tells the truth.
*   **Result:** Context. "This Python repo is a Django E-commerce site with Redis caching."

---

## 🛠️ 2. Implementation Specs

### **Endpoint:** `POST /api/v1/github/analyze`
**Input:** `{"github_url": "https://github.com/prateekrai"}`

### **Python Logic (`ml-service/app/services/github_scraper.py`)**

```python
import requests
import google.generativeai as genai

def analyze_github_profile(username: str):
    # 1. FETCH REPOS (Hard Data)
    # Sort by stars to get the best work first
    url = f"https://api.github.com/users/{username}/repos?sort=stars&per_page=5"
    repos = requests.get(url).json()
    
    technical_skills = set()
    project_descriptions = []
    
    for repo in repos:
        # A. Collect Languages
        if repo['language']:
            technical_skills.add(repo['language'])
            
        # B. Get Readme Content for AI Analysis
        readme_url = f"https://raw.githubusercontent.com/{username}/{repo['name']}/main/README.md"
        readme_response = requests.get(readme_url)
        
        if readme_response.status_code == 200:
            project_descriptions.append(f"Project: {repo['name']}\nReadme: {readme_response.text[:1000]}") # First 1000 chars

    # 2. AI ANALYSIS (The Brain)
    # Ask Gemini to summarize expertise based on Readmes
    prompt = f"""
    Analyze these GitHub projects and detailed Readmes.
    Extract the implied tech stack (libraries, frameworks) and assign a seniority level.
    
    Data:
    {project_descriptions}
    
    Return JSON: {{ "frameworks": ["Django", "React"], "level": "Intermediate" }}
    """
    
    ai_insight = genai.GenerativeModel('gemini-flash').generate_content(prompt)
    
    return {
        "verified_languages": list(technical_skills),
        "ai_insights": ai_insight.text
    }
```

---

## 🎯 3. Why this Impresses Interviewers
1.  **System Design:** You handle Rate Limiting (by picking top 5 repos).
2.  **Cost Optimization:** You don't feed *everything* to AI, only the Readmes (Tokens saved).
3.  **Real-world Value:** You solve the "Hello World" problem (distinguishing junk repos from real projects).
