from fastapi import FastAPI
import spacy

# Initialize FastAPI app
app = FastAPI()

# Load the spaCy NLP model
nlp = spacy.load("en_core_web_sm")

@app.get("/")
def home():
    return {"message": "SkillLoop AI Microservice is Active 🟢", "brain_status": "Loaded"}

@app.post("/test-brain")
def test_brain(text: str):
    doc = nlp(text)
    # Extract entities (like Name, Org, Date)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    return {"received_text": text, "entities_detected": entities}
