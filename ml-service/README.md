# ML Service 🤖

AI-powered microservice for resume parsing, recommendations, GitHub analysis, sentiment analysis, and AI interviewing.

## 📁 Folder Structure

```
ml-service/
├── app/
│   ├── main.py                          # FastAPI application entry
│   │
│   ├── routers/                         # API endpoint definitions
│   │   ├── resume.py                    # Resume parsing endpoints
│   │   ├── recommendation.py            # Recommendation endpoints
│   │   ├── github.py                    # GitHub analysis endpoints
│   │   ├── sentiment.py                 # Sentiment analysis endpoints
│   │   └── interview.py                 # AI interviewer endpoints
│   │
│   └── services/                        # Service layer (business logic)
│       ├── resume_parser/               # Resume parsing with custom NER
│       │   ├── __init__.py
│       │   ├── service.py               # Main parsing logic
│       │   ├── data/
│       │   │   ├── skills.json          # Skills database
│       │   │   └── ner_training_data.json
│       │   └── models/
│       │       └── custom_ner_model/    # Trained NER model
│       │
│       ├── github_scraper/              # GitHub profile analysis
│       │   ├── __init__.py
│       │   └── service.py               # GitHub API + Gemini AI
│       │
│       ├── recommender/                 # ML-based mentor matching
│       │   ├── __init__.py
│       │   └── service.py               # TF-IDF + Cosine similarity
│       │
│       ├── sentiment_analyzer/          # Sentiment analysis
│       │   ├── __init__.py
│       │   ├── service.py               # LSTM model inference
│       │   └── models/
│       │       ├── sentiment_model.h5   # Trained Keras model
│       │       └── tokenizer.pkl        # Text tokenizer
│       │
│       └── ai_interviewer/              # AI-powered interviewing
│           ├── __init__.py
│           └── service.py               # Gemini-based Q&A
│
├── scripts/                             # Training & testing scripts
│   ├── train_ner_model.py               # Train custom NER model
│   ├── preprocess_dataset.py            # Data preprocessing
│   ├── train_sentiment_model.py         # Train sentiment model
│   ├── test_recommender.py              # Test recommendation system
│   └── test_integration.py              # Integration tests
│
├── verification/                        # Verification scripts
│   └── verify_model.py                  # Model validation
│
├── requirements.txt                     # Python dependencies
├── .env                                 # Environment variables
└── README.md                            # This file
```

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

### 2. Run the Service
```bash
uvicorn app.main:app --reload --port 8000
```

API will be available at: `http://localhost:8000`

## 🔧 Training Scripts

All training and testing scripts are in the `scripts/` folder:

### Train Custom NER Model
```bash
cd scripts
python train_ner_model.py
```

### Preprocess Dataset
```bash
cd scripts
python preprocess_dataset.py
```

### Train Sentiment Model
```bash
cd scripts
python train_sentiment_model.py
```

### Test Recommender System
```bash
cd scripts
python test_recommender.py
```

### Integration Tests
```bash
cd scripts
python test_integration.py
```

## 🧩 Services Overview

### 1. Resume Parser
- **Location**: `app/services/resume_parser/`
- **Technology**: Custom NER with spaCy
- **Purpose**: Extract skills, experience, bio from PDF resumes
- **Usage**:
```python
from app.services.resume_parser import extract_text_from_pdf, analyze_resume_text
```

### 2. GitHub Scraper
- **Location**: `app/services/github_scraper/`
- **Technology**: GitHub API + Gemini AI
- **Purpose**: Analyze GitHub profiles for tech stack and seniority
- **Usage**:
```python
from app.services.github_scraper import analyze_github_profile
```

### 3. Recommender
- **Location**: `app/services/recommender/`
- **Technology**: TF-IDF + Cosine Similarity
- **Purpose**: ML-based mentor matching system
- **Usage**:
```python
from app.services.recommender import recommender
```

### 4. Sentiment Analyzer
- **Location**: `app/services/sentiment_analyzer/`
- **Technology**: LSTM (Keras/TensorFlow)
- **Purpose**: Analyze sentiment of reviews/feedback
- **Models**: 
  - `sentiment_model.h5` (18.7 MB)
  - `tokenizer.pkl` (2.0 MB)
- **Usage**:
```python
from app.services.sentiment_analyzer import get_analyzer
analyzer = get_analyzer()
result = analyzer.predict("This mentor was great!")
```

### 5. AI Interviewer
- **Location**: `app/services/ai_interviewer/`
- **Technology**: Gemini AI (Google)
- **Purpose**: Generate interview questions and evaluate answers
- **Usage**:
```python
from app.services.ai_interviewer import GeminiInterviewer
```

## 🔍 API Endpoints

### Resume Parsing
```bash
POST /api/resume/parse
Content-Type: multipart/form-data
Body: { file: resume.pdf }
```

### Get Recommendations
```bash
POST /api/recommendations/match
Body: { target_user: {...}, candidates: [...] }
```

### GitHub Analysis
```bash
POST /api/github/analyze
Body: { github_url: "https://github.com/username" }
```

### Sentiment Analysis
```bash
POST /api/sentiment/analyze
Body: { text: "This mentor was great!" }
```

### AI Interviewer
```bash
POST /api/interview/generate
Body: { skill: "Python", difficulty: "Medium" }

POST /api/interview/evaluate
Body: { question: "...", user_answer: "..." }
```

## 📚 Documentation

- **NER Model Guide**: See `ner_model_explanation.md` in brain artifacts
- **Restructuring Summary**: See `ml_service_reorganization.md`
- **Implementation Plan**: See `implementation_plan.md`

## 🛠️ Development

### Service Structure
Each service follows a consistent pattern:
```
service_name/
├── __init__.py          # Exports public API
└── service.py           # Core implementation
```

Models are stored within their respective service folders.

### Adding New Services
1. Create folder: `app/services/new_service/`
2. Add `__init__.py` with exports
3. Add `service.py` with implementation
4. Create router in `app/routers/`
5. Register router in `app/main.py`

### Adding New Models
Place trained model files in `app/services/<service_name>/models/`

## 🔐 Environment Variables

Create a `.env` file with:
```
GEMINI_API_KEY=your_api_key_here
```

## 📝 Architecture Principles

✅ **Consistent Structure**: All services follow the same pattern  
✅ **Service Isolation**: Each service is self-contained  
✅ **Clean Imports**: Use `from app.services.X import Y`  
✅ **Models with Services**: Model files live with their services  
✅ **No Duplicate Folders**: Single source of truth for each component  

## 🎯 Benefits

- **Industry Standard**: Follows best practices for microservice architecture
- **Scalable**: Easy to add new services
- **Maintainable**: Clear separation of concerns
- **Testable**: Services can be tested independently
