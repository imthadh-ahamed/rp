from sentence_transformers import SentenceTransformer
import traceback

print("DEBUG: Starting model load test")
try:
    print("Loading BAAI/bge-base-en-v1.5...")
    model = SentenceTransformer("BAAI/bge-base-en-v1.5")
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    traceback.print_exc()
print("DEBUG: Script finished")
