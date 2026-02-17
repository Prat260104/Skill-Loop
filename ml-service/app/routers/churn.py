from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.churn.model import churn_model

router = APIRouter()

class ChurnRequest(BaseModel):
    user_id: int
    days_since_login: int
    sessions_attended: int
    profile_score: int

class ChurnResponse(BaseModel):
    user_id: int
    churn_probability: float
    is_high_risk: bool
    message: str

@router.post("/predict", response_model=ChurnResponse)
def predict_churn(request: ChurnRequest):
    try:
        # 1. Get Probability from Model
        probability = churn_model.predict(
            request.days_since_login,
            request.sessions_attended,
            request.profile_score
        )

        # 2. Determine Risk Level
        is_high_risk = probability > 0.7

        # 3. Generate Message directly here
        msg = "User is safe."
        if is_high_risk:
            msg = "High Risk! Immediate re-engagement required."
        elif probability > 0.4:
            msg = "Moderate Risk. Monitor closely."

        return {
            "user_id": request.user_id,
            "churn_probability": round(probability, 2),
            "is_high_risk": is_high_risk,
            "message": msg
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
