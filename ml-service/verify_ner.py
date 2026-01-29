import spacy
import pdfplumber

# Load Model
nlp = spacy.load("en_core_web_sm")

pdf_path = "test_resume.pdf"
text_content = ""

# 1. Extract Text
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text_content += page.extract_text() + "\n"

print("--- RAW TEXT ---")
print(text_content)
print("----------------")

# 2. Analyze
doc = nlp(text_content)

print("--- ENTITIES DETECTED ---")
for ent in doc.ents:
    print(f"Text: '{ent.text}' | Label: {ent.label_}")
print("-------------------------")
