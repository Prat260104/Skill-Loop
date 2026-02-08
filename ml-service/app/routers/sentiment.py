"""
Sentiment Analysis API Router
==============================
FastAPI endpoints for sentiment analysis service.

Endpoints:
    POST /api/sentiment/analyze - Analyze sentiment of text
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.sentiment_analyzer import get_analyzer

# Create router instance
router = APIRouter(
    prefix="/api/sentiment",
    tags=["Sentiment Analysis"]
)

# Initialize sentiment analyzer (loads model once)
analyzer = get_analyzer()


# Request/Response Models (DTOs)
class SentimentRequest(BaseModel):
    """Request body for sentiment analysis"""
    text: str = Field(..., min_length=1, description="Text to analyze for sentiment")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "This mentor was absolutely amazing! I learned so much."
            }
        }


class SentimentResponse(BaseModel):
    """Response body for sentiment analysis"""
    score: float = Field(..., description="Sentiment score from -1 (negative) to +1 (positive)")
    label: str = Field(..., description="Sentiment label: POSITIVE or NEGATIVE")
    confidence: float = Field(..., description="Confidence level from 0 to 1")
    
    class Config:
        json_schema_extra = {
            "example": {
                "score": 0.85,
                "label": "POSITIVE",
                "confidence": 0.85
            }
        }


# API Endpoints
@router.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    Analyze sentiment of provided text.
    
    Uses trained LSTM model to predict whether text is positive or negative.
    Returns sentiment score (-1 to +1), label, and confidence.
    
    Args:
        request: SentimentRequest with text to analyze
    
    Returns:
        SentimentResponse with score, label, and confidence
    
    Example:
        POST /api/sentiment/analyze
        Body: {"text": "This mentor was great!"}
        Response: {"score": 0.85, "label": "POSITIVE", "confidence": 0.85}
    """
    try:
        # Validate input
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Call sentiment analyzer service
        result = analyzer.predict(request.text)
        
        # Return response
        return SentimentResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Sentiment analysis failed: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Health check endpoint for sentiment service.
    
    Returns:
        Status of sentiment analyzer
    """
    return {
        "status": "healthy",
        "service": "sentiment-analyzer",
        "model_loaded": analyzer.model is not None
    }
