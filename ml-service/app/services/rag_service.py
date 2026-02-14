import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

# Initialize Embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Initialize Vector DB (Persisted)
# Collection name 'resume_store' ensures we keep resumes separate
vector_store = Chroma(
    embedding_function=embeddings,
    persist_directory="./chroma_db",
    collection_name="resume_store"
)

# Initialize LLM
llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.7)

def ingest_document(text: str, user_id: str):
    """
    Ingests a document (Resume/Profile) into the Vector DB.
    Metadata includes user_id for filtering.
    """
    # Create a Document object
    doc = Document(
        page_content=text,
        metadata={"user_id": str(user_id)}
    )
    
    # Add to Chroma (Automatically handles embedding and storage)
    vector_store.add_documents([doc])
    print(f"✅ Ingested document for user {user_id}")
    return True

def get_interview_question(topic: str, user_id: str):
    """
    Retrieves context from the user's resume and generates a specific question.
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
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Ask me a question about {topic}")
    ])
    
    # 3. Create the RAG Chain
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    
    # 4. Invoke the Chain
    response = rag_chain.invoke({"topic": topic})
    
    return response["answer"]
