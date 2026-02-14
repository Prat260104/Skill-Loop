try:
    from langchain.chains import create_retrieval_chain
    print("✅ from langchain.chains import create_retrieval_chain SUCCESS")
except ImportError as e:
    print(f"❌ from langchain.chains import create_retrieval_chain FAILED: {e}")

try:
    from langchain_classic.chains import create_retrieval_chain
    print("✅ from langchain_classic.chains import create_retrieval_chain SUCCESS")
except ImportError as e:
    print(f"❌ from langchain_classic.chains import create_retrieval_chain FAILED: {e}")

try:
    from langchain_classic.chains.retrieval import create_retrieval_chain
    print("✅ from langchain_classic.chains.retrieval import create_retrieval_chain SUCCESS")
except ImportError as e:
    print(f"❌ from langchain_classic.chains.retrieval import create_retrieval_chain FAILED: {e}")

