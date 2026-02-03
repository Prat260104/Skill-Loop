from fastapi import FastAPI
from app.routers import resume, interview, recommendation

app = FastAPI(title="SkillLoop ML Service", version="1.0.0")

# Include Routers (Modules)
app.include_router(resume.router, prefix="/api/v1/resume", tags=["Resume Parser"])
app.include_router(interview.router, prefix="/api/v1/interview", tags=["AI Interviewer"])
app.include_router(recommendation.router, prefix="/api/v1/recommend", tags=["Smart Matching"])

@app.get("/")
def home():
    return {"message": "SkillLoop ML Service Gateway Active 🚀"}
