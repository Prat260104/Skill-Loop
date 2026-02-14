import requests
import json

def test_github_scraper():
    url = "http://localhost:8001/api/v1/github/analyze"
    payload = {"github_url": "Prat260104"}  # Using the user's username from corpus
    headers = {"Content-Type": "application/json"}
    
    try:
        print(f"Sending request to {url} with payload {payload}")
        response = requests.post(url, json=payload, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        try:
            print("Response JSON:")
            print(json.dumps(response.json(), indent=2))
        except:
            print("Response Text:")
            print(response.text)
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_github_scraper()
