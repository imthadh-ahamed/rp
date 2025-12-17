import shutil
import traceback
print("DEBUG: Script started")
import json
import os
import sys
import numpy as np
import chromadb

# Add parent directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
sys.path.insert(0, backend_dir)

# Import Nomic embedder
from core.rag.nomic_embedder import get_nomic_embedder

try:
    # Initialize Nomic embedding model
    print("Loading embedding model: nomic-ai/nomic-embed-text-v1.5...")
    embedder = get_nomic_embedder()

    # Load JSON
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(script_dir)

    with open(os.path.join(backend_dir, "data", "raw", "CourseData.json"), "r", encoding="utf-8") as f:
        courses = json.load(f)

    # Chroma DB client - using PersistentClient with cosine similarity
    persist_dir = os.path.join(backend_dir, "data", "embeddings")

    # Clear existing embeddings to ensure clean rebuild
    if os.path.exists(persist_dir):
        print(f"Clearing existing embeddings at {persist_dir}...")
        try:
            shutil.rmtree(persist_dir)
        except Exception as e:
            print(f"Warning: Could not delete {persist_dir}: {e}")

    os.makedirs(persist_dir, exist_ok=True)
    chroma = chromadb.PersistentClient(path=persist_dir)

    # Delete old collection and create new one with cosine similarity
    try:
        chroma.delete_collection(name="courses")
        print("Deleted old collection")
    except:
        pass

    collection = chroma.create_collection(
        name="courses",
        metadata={"hnsw:space": "cosine"}  # Use cosine similarity instead of L2
    )

    print("Created new collection with cosine similarity")

    # Build course text with richer structure
    def build_text(course):
        return f"""
        Course Title: {course.get('Course', 'N/A')}
        Offered By: {course.get('Department', 'N/A')} at {course.get('Campus', 'N/A')}
        Study Language: {course.get('Study Language', 'N/A')}
        Study Method: {course.get('Study Method', 'N/A')}
        Duration: {course.get('Duration', 'N/A')}

        Admission Requirements:
        {course.get('Entry Requirements', 'N/A')}

        Career Opportunities:
        {course.get('Career Opportunities', 'N/A')}

        English Requirement Level: {course.get('English Level', 'N/A')}
        Fees: {course.get('Course Fees', 'N/A')}
        Location: {course.get('Location', 'N/A')}

        URL: {course.get('URL', 'N/A')}
        """

    # Normalize embeddings for better similarity
    def normalize(v):
        """Normalize embedding vector"""
        return (np.array(v) / np.linalg.norm(v)).tolist()

    # Generate embeddings with Nomic
    def embed_text(text):
        return embedder.embed(text, normalize=True)


    # Build embeddings
    ids, documents, embeddings, metadatas = [], [], [], []

    print(f"Processing {len(courses)} courses...")
    for idx, c in enumerate(courses):
        print(f"Processing course {idx + 1}/{len(courses)}: {c.get('Course', 'Unknown')}")
        
        text = build_text(c)
        vector = embed_text(text)
        
        # Create clean metadata - convert all values to strings
        metadata = {
            "course": str(c.get('Course', '')),
            "department": str(c.get('Department', '')),
            "campus": str(c.get('Campus', '')),
            "duration": str(c.get('Duration', '')),
            "location": str(c.get('Location', '')),
            "study_method": str(c.get('Study Method', '')),
            "url": str(c.get('URL', ''))
        }

        ids.append(str(idx))
        documents.append(text)
        embeddings.append(vector)
        metadatas.append(metadata)

    print("\nAdding to ChromaDB...")
    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas
    )

    # PersistentClient auto-saves, no need to call persist()
    print(f"\n✅ Vector index created successfully with Nomic embeddings!")
    print(f"   Total courses indexed: {len(courses)}")
    print(f"   Embeddings saved to: {persist_dir}")

except Exception as e:
    print(f"\n❌ CRITICAL ERROR: {e}")
    traceback.print_exc()
