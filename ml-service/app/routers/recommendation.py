from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from app.services.recommender import recommender

router = APIRouter()

# --- Pydantic Models for Input Validation ---

from pydantic import BaseModel, Field

class UserProfileDTO(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = ""
    skills_offered: List[str] = Field(default=[], alias="skillsOffered")
    skills_wanted: List[str] = Field(default=[], alias="skillsWanted")
    verified_skills: List[str] = Field(default=[], alias="verifiedSkills")
    experience: List[str] = Field(default=[], alias="experience")
    skill_points: Optional[int] = Field(default=0, alias="skillPoints")

    class Config:
        populate_by_name = True
        allow_population_by_field_name = True # Support for Pydantic v1 & v2

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
        print(f"DEBUG: Target User Dict keys: {target_user_dict.keys()}")
        print(f"DEBUG: Target User Skills Wanted: {target_user_dict.get('skills_wanted')}")
        
        return {"matches": matches}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")
