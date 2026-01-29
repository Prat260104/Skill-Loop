# ❓ Asked Questions - ML Service

## Q1: FastAPI, Uvicorn, spacy, pdfplumber, python-multipart - humne ye sab install kiya, par kyu? Ye kya karte hain?

**Answer:**

### 1. **FastAPI** (`fastapi`)
Ye hamara **Web Framework** hai. Jaise Java mein Spring Boot hai, waise hi Python mein FastAPI hai.
*   **Kaam:** Isse hum APIs (routes) banayenge, jaise `POST /parse-resume`.
*   **Kyun:** Ye bahut fast hai aur modern hai.

### 2. **Uvicorn** (`uvicorn`)
Ye hamara **Server** hai.
*   **Kaam:** FastAPI code ko run karta hai taaki wo requests receive kar sake.
*   **Analogy:** Jaise Spring Boot mein Tomcat embedded hota hai, waise hi FastAPI ko chalane ke liye Uvicorn chahiye hota hai.

### 3. **spaCy** (`spacy`)
Ye hamara **AI Main Brain** (NLP Engine) hai.
*   **Kaam:** Text ko padhna aur samajhna. Ye sentence mein se entities (naam, skills, dates) nikalne ka kaam karega.
*   **Kyun:** Ye industrial-strength NLP library hai, research level ki nahi, balki production level pe kaam aati hai.

### 4. **pdfplumber** (`pdfplumber`)
Ye hamara **Reader** hai.
*   **Kaam:** PDF file ko kholna aur usme se text extract karna.
*   **Kyun:** PDFs complex hote hain, pdfplumber unhe easily text format mein convert kar deta hai taaki spaCy unhe padh sake.

### 5. **python-multipart** (`python-multipart`)
Ye ek **Helper** hai.
*   **Kaam:** Jab frontend se file upload hoti hai (form data), toh ye library us file ko receive karne mein FastAPI ki madad karti hai.

---

### **Flow Kaisa Hoga?**
1.  **python-multipart** file receive karega.
2.  **pdfplumber** us file ko padh ke text banayega.
3.  **spaCy** us text ko analyze karke skills aur data nikalega.
4.  **FastAPI** wo data wapas bhej dega.
5.  **Uvicorn** ye sab run karega.

## Q2: main.py ka basic structure samjhao. Har line kya kar rahi hai?

**Answer:**

Abhi jo humne `main.py` likha, wo 4 parts mein divided hai:

### **Part 1: Imports (Saman lana)**
```python
from fastapi import FastAPI
import spacy
# FastAPI: Ye humara 'Spring Boot' hai, jo API server banayega.
# spacy: Ye humara 'Brain' hai, jo text ko padhega.
```

### **Part 2: Initialization (Startup)**
```python
app = FastAPI() 
# Ye line server start hone ka base hai. Isse ek 'app' object banta hai
# jiske andar saare routes register honge. 
# (Jaise Spring mein @SpringBootApplication hota hai).

nlp = spacy.load("en_core_web_sm")
# Ye line AI model ko memory mein load karti hai.
# 'nlp' variable ab ek machine hai jisme English language ka gyaan bhara hua hai.
```

### **Part 3: Health Check Route (GET /)**
```python
@app.get("/")
def home():
    return {"message": "SkillLoop AI Microservice is Active 🟢", "brain_status": "Loaded"}
```
*   **`@app.get("/")`**: Ye ek **Decorator** hai (Annotation jaisa). Ye batata hai ki jab koi browser mein `http://.../` open karega (GET request), toh ye function chalega.
*   **Function**: Ye simple JSON return kar raha hai taki hum confirmed rahein ki server zinda hai.

### **Part 4: AI Logic Route (POST /test-brain)**
```python
@app.post("/test-brain")
def test_brain(text: str):
    doc = nlp(text)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    return {"received_text": text, "entities_detected": entities}
```
*   **`@app.post`**: Hum POST use kar rahe hain kyunki hum data (text) bhej rahe hain server ko.
*   **`doc = nlp(text)`**: Yahi hai asli jaadu! Humne `nlp` machine ko `text` diya. Usne text padha aur ek `doc` object banaya jisme words ke meaning stored hain.
*   **`doc.ents`**: `ents` matlab **Entities** (naam, jagah, dates, etc.). Hum loop chala ke `text` (kya dhoonda) aur `label_` (wo kya hai - PERSON, DATE, ORG) nikal rahe hain.
