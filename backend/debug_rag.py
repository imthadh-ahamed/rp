import sys
import os
import logging

# Configure logging to print to stdout
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure backend path is in sys.path
sys.path.append(os.getcwd())

try:
    print("Attempting to import quiz_rag_service...")
    from core.services import quiz_rag_service
    print("Import successful.")

    print("Attempting to initialize RAG service...")
    quiz_rag_service.init_rag_service()
    
    if quiz_rag_service.collection:
        print(f"RAG Service initialized successfully. Collection count: {quiz_rag_service.collection.count()}")
    else:
        print("RAG Service failed to initialize (collection is None). Check logs above.")
        
    # Check if we can get a stream
    print("Attempting to query stream 'biological_science'...")
    results = quiz_rag_service.retrieve_top_k_for_stream("biological_science", top_k=1)
    print(f"Query results: {len(results)} chunks found.")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
