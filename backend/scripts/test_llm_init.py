"""
Simple test for Local LLM client initialization
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm.airllm_client import get_airllm_client

print("\n" + "="*60)
print("Testing Local LLM Client Initialization")
print("="*60)

try:
    client = get_airllm_client()
    print("✅ Client initialized successfully")
    print(f"   Gemma model name: {client.gemma_model_name}")
    print(f"   TinyLlama model name: {client.tinyllama_model_name}")
    print(f"   Device: {client.device}")
    print("\n📌 Note: Models will be downloaded on first use")
    print("   This test only checks initialization, not model loading")
    print("="*60 + "\n")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
