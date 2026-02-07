"""Direct test of TinyLlama model loading and generation"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from llm.airllm_client import get_airllm_client

print("🧠 Testing TinyLlama Direct Load...")
print("=" * 80)

client = get_airllm_client()

print("\n📥 Loading TinyLlama model (this may take a few minutes on first run)...")
print("   Downloading ~1.1GB if not cached...")

try:
    # Simple test prompt
    prompt = "Explain why someone interested in software engineering should consider this course: BSc (Hons) Software Engineering Degree"
    system = "You are a helpful course advisor. Provide brief, clear explanations."
    
    print(f"\n💬 Prompt: {prompt[:100]}...")
    print("\n⏳ Generating response...")
    
    response = client.chat_tinyllama(
        prompt,
        system=system,
        max_tokens=100,
        temperature=0.3
    )
    
    print("\n✅ Response generated successfully!")
    print("=" * 80)
    print(response)
    print("=" * 80)
    
except Exception as e:
    print(f"\n❌ Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
