from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from app.services.recommender import recommender

router = APIRouter()

# --- Pydantic Models for Input Validation ---

class UserProfileDTO(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    role: Optional[str] = None
    skills_offered: List[str] = []
    skills_wanted: List[str] = []
    bio: Optional[str] = ""
    verified_skills: List[str] = []

    class Config:
        strict = False # Allow loose parsing if slightly different fields come in

class RecommendationRequest(BaseModel):
    target_user: UserProfileDTO
    candidates: List[UserProfileDTO]
    top_k: Optional[int] = 5

# --- Endpoints ---

@router.post("/match", summary="Get Recommended Mentors")
async def get_recommendations(request: RecommendationRequest):
    """
    Receives a Target User and a list of Candidates.
    Returns the Candidates ranked by match score using TF-IDF & Cosine Similarity.
    """
    try:
        # Convert Pydantic models to Dicts for the service layer
        target_user_dict = request.target_user.dict()
        candidate_dicts = [c.dict() for c in request.candidates]

        matches = recommender.recommend_mentors(
            target_user=target_user_dict,
            candidates=candidate_dicts,
            top_k=request.top_k
        )
        
        return {"matches": matches}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")
