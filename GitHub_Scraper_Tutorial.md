# 🎓 Tutorial: Building the GitHub Scraper (The "Hybrid" Way)

Welcome! This guide explains *exactly* how to build the GitHub Scraper feature we designed. It's a mix of **API Engineering** (for speed) and **AI** (for intelligence).

---

## 🛠️ Step 1: Get the Raw Data (The Skeleton)

We don't "scrape" HTML (parse `div` tags) because it's slow and breaks if GitHub changes their CSS. Instead, we use the **GitHub API**.

### The Concept
GitHub provides a URL: `https://api.github.com/users/YOUR_USERNAME/repos`.
When you hit this, you get a JSON list of all your projects.

### The Code (Mental Model)
```python
# 1. User ka username lo
username = "prat260104"

# 2. GitHub se data maango
response = requests.get(f"https://api.github.com/users/{username}/repos")
repos = response.json()

# 3. Simple Loop chalao
for repo in repos:
    print(repo['name'])      # "SkillLoop"
    print(repo['language'])  # "JavaScript"
```

**Why this matters:** This solves 80% of the problem instantly. We know you write JavaScript.

---

## 🧠 Step 2: Add Intelligence (The Brain)

Knowing you use "JavaScript" isn't enough. Is it a simple "To-Do List" or a "Complex React Dashboard"?
Here we use **Gemini AI**.

### The Concept
Every good project has a **`README.md`**. We will fetch that text and feed it to the AI.

### The Code (Mental Model)
```python
# 1. Readme ka URL banao (Raw Content)
readme_url = f"https://raw.githubusercontent.com/{username}/{repo_name}/main/README.md"

# 2. Text Download karo
readme_text = requests.get(readme_url).text

# 3. Gemini ko bolo: "Padh ke batao ye kya hai"
prompt = f"Extract frameworks and difficulty from this text: {readme_text}"
insight = model.generate_content(prompt)

print(insight) # Output: "React, Redux, Advanced Level"
```

---

## 🔗 Step 3: Integration (Putting it together)

We combine Step 1 and Step 2 into a single API endpoint in our `ml-service`.

1.  **Input:** User gives GitHub URL.
2.  **Process:**
    *   Fetch Top 5 Repos (API).
    *   Read their Readmes (API).
    *   Ask Gemini to summarize (AI).
3.  **Output:** Final list of skills to Frontend.

---

## 🚀 Why this works for Production?

*   **Rate Limits:** Hum sab kuch scan nahi kar rahe, sirf Top 5 repos. Fast execution.
*   **Cost:** Hum Gemini ko poora code nahi bhej rahe, sirf English text (Readme). Cheaper.
*   **Accuracy:** User jhoot nahi bol sakta, hum code dekh rahe hain.

---

Ready to build this? Just follow `github_scraper_design.md` whenever you start coding!
