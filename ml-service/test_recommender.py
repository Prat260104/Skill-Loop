import requests
import json

url = "http://localhost:8000/api/v1/recommend/match"

# 1. Define the Target User (Student looking for a mentor)
target_user = {
    "id": 1,
    "name": "Student Steve",
    "role": "Student",
    "skills_offered": ["HTML", "CSS"],
    "skills_wanted": ["Python", "Machine Learning"],
    "bio": "I want to learn AI and build cool models."
}

# 2. Define Candidates (Potential Mentors)
candidates = [
    {
        "id": 101,
        "name": "Mentor Mike",
        "role": "Mentor",
        "skills_offered": ["Python", "TensorFlow", "Machine Learning"],
        "skills_wanted": ["Cooking"],
        "bio": "Expert in AI and Python."
    },
    {
        "id": 102,
        "name": "Mentor Sarah",
        "role": "Mentor",
        "skills_offered": ["Java", "Spring Boot"],
        "skills_wanted": ["Dancing"],
        "bio": "Java backend developer with 5 years experience."
    },
    {
        "id": 103,
        "name": "Mentor Dave",
        "role": "Mentor",
        "skills_offered": ["React", "Node.js"],
        "skills_wanted": [],
        "bio": "Frontend wizard."
    }
]

payload = {
    "target_user": target_user,
    "candidates": candidates,
    "top_k": 3
}

print(f"Sending request to {url}...")
try:
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("\n✅ Success! Matches found:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"\n❌ Error {response.status_code}: {response.text}")

except Exception as e:
    print(f"\n❌ Failed to connect: {e}")
