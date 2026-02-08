from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume, interview, recommendation, github, sentiment

app = FastAPI(title="SkillLoop ML Service", version="1.0.0")

# Enable CORS for Frontend Access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev; specify frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers (Modules)
app.include_router(resume.router, prefix="/api/v1/resume", tags=["Resume Parser"])
app.include_router(interview.router, prefix="/api/v1/interview", tags=["AI Interviewer"])
app.include_router(recommendation.router, prefix="/api/v1/recommend", tags=["Smart Matching"])
app.include_router(github.router, prefix="/api/v1/github", tags=["GitHub Scraper"])
app.include_router(sentiment.router)  # Uses prefix from router definition

@app.get("/")
def home():
    return {"message": "SkillLoop ML Service Gateway Active 🚀"}
