import sys
import os

# Add backend directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
sys.path.insert(0, backend_dir)

from core.rag.retriever import rag_search

# Sample user profile
sample_user = {
    "age": 19,
    "native_language": "Tamil",
    "preferred_language": "English",
    "ol_results": "Maths B, Science C, English C, ICT B",
    "al_stream": "Technology",
    "interest_area": "Cybersecurity",
    "career_goal": "Network Security Engineer",
    "study_method": "Full Time",
    "current_location": "Colombo",
    "preferred_locations": "Colombo",
}

print("="*80)
print("🔍 Testing RAG Retrieval Pipeline")
print("="*80)
print("\n📋 User Profile:")
print(f"   Age: {sample_user['age']}")
print(f"   Interest: {sample_user['interest_area']}")
print(f"   Career Goal: {sample_user['career_goal']}")
print(f"   Study Method: {sample_user['study_method']}")
print(f"   Location: {sample_user['current_location']}")
print("\n" + "="*80)
print("🎯 Retrieving Top 10 Matching Courses...")
print("="*80 + "\n")

# Perform RAG search
results = rag_search(sample_user, top_k=10)

# Display results
for idx, r in enumerate(results, 1):
    print(f"\n{'='*80}")
    print(f"📚 Result #{idx}")
    print(f"{'='*80}")
    print(f"Course: {r['course']}")
    print(f"Similarity Score: {r['distance']:.4f} (lower is better)")
    print(f"Department: {r['metadata'].get('department', 'N/A')}")
    print(f"Campus: {r['metadata'].get('campus', 'N/A')}")
    print(f"Duration: {r['metadata'].get('duration', 'N/A')}")
    print(f"URL: {r['metadata'].get('url', 'N/A')}")

print("\n" + "="*80)
print("✅ RAG Retrieval Test Complete!")
print("="*80)
