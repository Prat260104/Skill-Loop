import requests
import json

url = "http://localhost:8001/api/v1/recommend/match"

# 1. Define the Target User (Student looking for a mentor)
target_user = {
    "id": 1,
    "name": "Student Steve",
    "role": "Student",
    "skills_offered": ["HTML", "CSS"],
    "skills_wanted": ["Python", "Machine Learning"],
    "bio": "I want to learn AI and build cool models.",
    "experience": ["Frontend", "Web Development"],
    "skill_points": 50
}

# 2. Define Candidates (Potential Mentors with different profiles)
candidates = [
    {
        "id": 101,
        "name": "Mentor Mike (Perfect Match)",
        "role": "Mentor",
        "skills_offered": ["Python", "TensorFlow", "Machine Learning"],
        "skills_wanted": ["Cooking"],
        "bio": "Expert in AI and Python.",
        "experience": ["Machine Learning", "Data Science", "Backend"],
        "skill_points": 450  # High activity
    },
    {
        "id": 102,
        "name": "Mentor Sarah (Partial Match)",
        "role": "Mentor",
        "skills_offered": ["Java", "Spring Boot"],
        "skills_wanted": ["Dancing"],
        "bio": "Java backend developer with 5 years experience.",
        "experience": ["Backend", "Web Development"],
        "skill_points": 200  # Medium activity
    },
    {
        "id": 103,
        "name": "Mentor Dave (Poor Match)",
        "role": "Mentor",
        "skills_offered": ["React", "Node.js"],
        "skills_wanted": [],
        "bio": "Frontend wizard.",
        "experience": ["Frontend"],
        "skill_points": 25  # Low activity
    },
    {
        "id": 104,
        "name": "Mentor Lisa (Good Skills, Low Activity)",
        "role": "Mentor",
        "skills_offered": ["Python", "Django"],
        "skills_wanted": [],
        "bio": "Python developer.",
        "experience": ["Backend"],
        "skill_points": 10  # Very low activity
    }
]

payload = {
    "target_user": target_user,
    "candidates": candidates,
    "top_k": 5
}

print(f"🧪 Testing Weighted Recommendation Algorithm")
print(f"Target: {target_user['name']} wants {target_user['skills_wanted']}")
print(f"\nSending request to {url}...")
print("="*60)

try:
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("\n✅ Success! Matches found:\n")
        matches = response.json().get("matches", [])
        
        for i, match in enumerate(matches, 1):
            print(f"{i}. {match['name']} - Match Score: {match['match_score']}%")
            if 'score_breakdown' in match:
                breakdown = match['score_breakdown']
                print(f"   Skills: {breakdown['skill_similarity']}% | "
                      f"Experience: {breakdown['experience_match']}% | "
                      f"Activity: {breakdown['activity_score']}%")
            print()
        
        print("\n" + "="*60)
        print("Full Response:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"\n❌ Error {response.status_code}: {response.text}")

except Exception as e:
    print(f"\n❌ Failed to connect: {e}")
    print("Make sure ML service is running on port 8001")
