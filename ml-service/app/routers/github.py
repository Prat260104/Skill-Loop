from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.github_scraper import analyze_github_profile
import re

router = APIRouter()

class GithubRequest(BaseModel):
    github_url: str

@router.post("/analyze")
async def analyze_github(request: GithubRequest):
    """
    Analyzes a GitHub profile from a URL or Username.
    Example Input: { "github_url": "https://github.com/prateekrai" }
    """
    raw_input = request.github_url.strip()
    
    # Extract username if full URL is provided
    # Logic: Look for 'github.com/' and take everything after it
    if "github.com/" in raw_input:
        username = raw_input.split("github.com/")[-1].strip("/")
    else:
        username = raw_input # Assume it's just the username
        
    # Validate username (basic regex for GitHub usernames)
    if not re.match(r"^[a-zA-Z0-9-]+$", username):
         raise HTTPException(status_code=400, detail="Invalid GitHub Username format")
         
    # Call the Service
    try:
        result = analyze_github_profile(username)
        
        if "error" in result:
             raise HTTPException(status_code=400, detail=result["error"])
             
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
