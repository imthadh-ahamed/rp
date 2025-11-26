
# Build Index Script
import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer
import chromadb

# Initialize SentenceTransformer model
print("Loading embedding model: all-MiniLM-L6-v2...")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Load JSON
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)

with open(os.path.join(backend_dir, "data", "raw", "CourseData.json"), "r", encoding="utf-8") as f:
    courses = json.load(f)

# Chroma DB client - using PersistentClient with cosine similarity
persist_dir = os.path.join(backend_dir, "data", "embeddings")
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

# Generate embeddings with SentenceTransformer
def embed_text(text):
    embedding = embed_model.encode(text, convert_to_tensor=False, normalize_embeddings=True)
    return embedding.tolist()


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
print(f"\n✅ Vector index created successfully with SentenceTransformer embeddings!")
print(f"   Total courses indexed: {len(courses)}")
print(f"   Embeddings saved to: {persist_dir}")
