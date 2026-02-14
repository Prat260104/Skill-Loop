try:
    from langchain.chains import create_retrieval_chain
    print("✅ from langchain.chains import create_retrieval_chain SUCCESS")
except ImportError as e:
    print(f"❌ from langchain.chains import create_retrieval_chain FAILED: {e}")

try:
    from langchain.chains.retrieval import create_retrieval_chain
    print("✅ from langchain.chains.retrieval import create_retrieval_chain SUCCESS")
except ImportError as e:
    print(f"❌ from langchain.chains.retrieval import create_retrieval_chain FAILED: {e}")

try:
    from langchain.chains.combine_documents import create_stuff_documents_chain
    print("✅ from langchain.chains.combine_documents import create_stuff_documents_chain SUCCESS")
except ImportError as e:
    print(f"❌ from langchain.chains.combine_documents import create_stuff_documents_chain FAILED: {e}")
