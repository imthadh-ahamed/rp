import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer
import chromadb

# Get paths
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(os.path.dirname(current_dir))
persist_dir = os.path.join(backend_dir, "data", "embeddings")

# Initialize SentenceTransformer model
print("Loading embedding model: BAAI/bge-base-en-v1.5...")
embed_model = SentenceTransformer("BAAI/bge-base-en-v1.5")

# Connect to ChromaDB
chroma = chromadb.PersistentClient(path=persist_dir)
collection = chroma.get_collection("courses")


def normalize(v):
    """Normalize embedding vector for better similarity"""
    return (np.array(v) / np.linalg.norm(v)).tolist()


def embed_text(text: str):
    """Generate normalized vector embedding using SentenceTransformer"""
    try:
        print(f"Generating embedding for text length: {len(text)}")
        # Generate embedding
        embedding = embed_model.encode(text, convert_to_tensor=False, normalize_embeddings=True)
        vec = embedding.tolist()
        print(f"Embedding generated. Dimension: {len(vec)}")
        return vec
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return []


def build_user_profile(user):
    """
    Convert structured user inputs → rich natural language profile.
    Enhanced with goal-oriented language for better semantic matching.
    """
    
    profile = f"""
    Provide course recommendations for a student with the following profile:

    - Age: {user.get('age', 'N/A')}
    - Native Language: {user.get('native_language', 'N/A')}
    - Preferred Study Language: {user.get('preferred_language', 'N/A')}
    - O/L Results: {user.get('ol_results', 'N/A')}
    - A/L Stream: {user.get('al_stream', 'N/A')}
    - A/L Results: {user.get('al_results', 'N/A')}
    - Other Qualifications: {user.get('other_qualifications', 'None')}
    - IELTS Score: {user.get('ielts', 'N/A')}
    - Interest Area: {user.get('interest_area', 'N/A')}
    - Career Goal: {user.get('career_goal', 'N/A')}
    - Monthly Family Income: {user.get('income', 'N/A')}
    - Study Method Preference: {user.get('study_method', 'N/A')}
    - Weekend/Weekday Availability: {user.get('availability', 'N/A')}
    - Target Completion Period: {user.get('completion_period', 'N/A')}
    - Current Location: {user.get('current_location', 'N/A')}
    - Preferred Study Locations: {user.get('preferred_locations', 'N/A')}

    The goal is to find the most academically suitable, financially suitable, and career-aligned degree courses.
    """

    return profile


def rag_search(user_input: dict, top_k: int = 10):
    """
    Main RAG search function.
    Takes user input → generates semantic query → retrieves best courses.
    """

    # Build user profile text
    user_profile_text = build_user_profile(user_input)

    # Generate embedding
    query_vec = embed_text(user_profile_text)
    
    if not query_vec:
        print("⚠️ Failed to generate embedding for query.")
        return []

    # Query vector database
    print(f"Querying ChromaDB with top_k={top_k}...")
    results = collection.query(
        query_embeddings=[query_vec],
        n_results=top_k
    )

    # Format output
    output = []
    if results["documents"]:
        num_found = len(results["documents"][0])
        print(f"ChromaDB found {num_found} documents.")
        for idx in range(num_found):
            doc = results["documents"][0][idx]
            meta = results["metadatas"][0][idx]
            distance = results["distances"][0][idx]
            
            output.append({
                "course": meta.get("course", "Unknown"),
                "distance": float(distance),
                "metadata": meta,
                "document": doc
            })
    else:
        print("ChromaDB returned no documents.")

    return output
