# ML Service 🤖

AI-powered microservice for resume parsing, recommendations, and AI interviewing.

## 📁 Folder Structure

```
ml-service/
├── app/                          # Main application code
│   ├── routers/                 # API endpoints
│   ├── services/                # Business logic
│   │   ├── resume_parser/       # Resume parsing with NER
│   │   │   ├── data/           # Training data & skills DB
│   │   │   ├── models/         # Trained NER models
│   │   │   └── parser_logic.py # Core parsing logic
│   │   ├── recommender.py      # ML recommendation system
│   │   └── ai_interviewer.py   # AI interview agent
│   └── main.py                  # FastAPI app
│
├── scripts/                      # Training & testing scripts
│   ├── train_ner_model.py       # Train custom NER model
│   ├── preprocess_dataset.py    # Data preprocessing
│   ├── train_sentiment_model.py # Train sentiment model
│   ├── test_recommender.py      # Test recommendation system
│   └── test_integration.py      # Integration tests
│
├── models/                       # Trained model files
│   ├── sentiment_model.h5       # Keras sentiment model
│   └── tokenizer.pkl            # Text tokenizer
│
├── verification/                 # Verification scripts
│   └── verify_model.py          # Model validation
│
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables
└── README.md                    # This file
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

## 📊 Models

All trained model files are stored in the `models/` folder:

- **sentiment_model.h5**: Keras deep learning model for sentiment analysis
- **tokenizer.pkl**: Pickle file containing the text tokenizer

Custom NER models are stored in: `app/services/resume_parser/models/custom_ner_model/`

## 🔍 API Endpoints

### Resume Parsing
```bash
POST /api/resume/parse
Content-Type: multipart/form-data
Body: { file: resume.pdf }
```

### Get Recommendations
```bash
GET /api/recommendations/{user_id}
```

### AI Interviewer
```bash
POST /api/interview/start
POST /api/interview/answer
```

## 📚 Documentation

- **NER Model Guide**: See `ner_model_explanation.md` in brain artifacts
- **ML Service Q&A**: See `Asked_Questions_ML_Service.md`

## 🛠️ Development

### Adding New Scripts
Place all training, testing, and utility scripts in the `scripts/` folder.

### Adding New Models
Place trained model files in the `models/` folder.

### Code Structure
- **Routers**: API endpoint definitions
- **Services**: Business logic and ML models
- **Scripts**: One-time training/testing scripts
- **Models**: Trained model artifacts

## 🔐 Environment Variables

Create a `.env` file with:
```
GEMINI_API_KEY=your_api_key_here
```

## 📝 Notes

- All scripts should be run from the `scripts/` directory
- Models are loaded automatically on service startup
- Custom NER model has priority over base spaCy model
