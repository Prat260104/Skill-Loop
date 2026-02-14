import json
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
try:
    from langchain.chains import create_retrieval_chain
    from langchain.chains.combine_documents import create_stuff_documents_chain
except ImportError:
    from langchain_classic.chains import create_retrieval_chain
    from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

# Initialize Embeddings
# Using text-embedding-004 is generally better, but user suspects model
# compatibility. Sticking to a known free-tier friendly embedding model.
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004") 

# Initialize Vector DB (Persisted)
# Collection name 'resume_store' ensures we keep resumes separate
vector_store = Chroma(
    embedding_function=embeddings,
    persist_directory="./chroma_db",
    collection_name="resume_store"
)

# Initialize LLM
# Switching back to 1.5-flash as it is the standard free model.
# The previous 404 might have been momentary or due to API version.
llm = ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", temperature=0.7)

def ingest_document(text: str, user_id: str):
    """
    Ingests a document (Resume/Profile) into the Vector DB.
    Metadata includes user_id for filtering.
    """
    try:
        # Create a Document object
        doc = Document(
            page_content=text,
            metadata={"user_id": str(user_id)}
        )
        
        # Add to Chroma (Automatically handles embedding and storage)
        vector_store.add_documents([doc])
        print(f"✅ Ingested document for user {user_id}")
        return True
    except Exception as e:
        print(f"❌ Ingestion Failed: {e}")
        # Identify if it's a model issue
        if "404" in str(e):
             print("⚠️ Model not found. Check API Key and Model Name.")
        return False

def get_interview_question(topic: str, user_id: str):
    """
    Retrieves context from the user's resume and generates a specific question.
    Returns: JSON dict {question, topic, difficulty}
    """
    # 1. Create Retriever with User Filter
    # We only want chunks belonging to THIS user
    retriever = vector_store.as_retriever(
        search_kwargs={"k": 3, "filter": {"user_id": str(user_id)}}
    )
    
    # 2. Define the Prompt Template
    system_prompt = (
        "You are an expert technical interviewer. "
        "Use the candidate's resume context below to ask a specific, "
        "insightful question about the following topic: {topic}. "
        "If the context doesn't mention the topic, ask a good general conceptual question "
        "but tailored to their experience level found in the resume."
        "\n\n"
        "Resume Context:\n"
        "{context}"
        "\n\n"
        "Rules:\n"
        "1. The question must be conceptual and require deep understanding.\n"
        "2. Provide the output in strict JSON format.\n"
        "3. Do NOT include markdown formatting (like ```json), just the raw JSON.\n"
        "\n"
        "JSON Structure:\n"
        "{{\n"
        "    \"question\": \"The actual question text\",\n"
        "    \"topic\": \"The specific sub-topic (e.g., Memory Management)\",\n"
        "    \"difficulty\": \"Medium\"\n"
        "}}"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Ask me a question about {topic}")
    ])
    
    # 3. Create the RAG Chain
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    
    # 4. Invoke the Chain
    try:
        # Pass 'input' for the retriever and 'topic' for the prompt
        response = rag_chain.invoke({"input": topic, "topic": topic})
        clean_text = response["answer"].replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"Error generating question: {e}")
        return {
            "question": f"Tell me about your experience with {topic}.",
            "topic": topic,
            "difficulty": "Medium",
            "fallback": True
        }

def evaluate_answer(question: str, user_answer: str):
    """
    Evaluates the user's answer to the given question.
    Returns: JSON dict {score, feedback, is_verified}
    """
    prompt = f"""
    Act as a Strict Technical Lead.
    
    Question: "{question}"
    Candidate's Answer: "{user_answer}"
    
    Evaluate this answer. 
    Return ONLY valid JSON.
    Do NOT include markdown formatting.
    
    JSON Structure:
    {{
        "score": (integer 0-100),
        "feedback": "1-2 sentences explaining why the score was given.",
        "is_verified": (boolean, true if score >= 70)
    }}
    """
    
    try:
        response = llm.invoke(prompt)
        content = response.content
        if isinstance(content, list):
            # content might be a list of parts, join them
            content = " ".join([str(c) for c in content])
            
        clean_text = content.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        return {"error": str(e)}
