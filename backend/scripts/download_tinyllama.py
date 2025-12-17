"""Download TinyLlama model explicitly before using in production"""
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

print("📥 Downloading TinyLlama-1.1B-Chat-v1.0...")
print("   This will download ~1.1GB of model files")
print("   Please wait, this may take several minutes...")
print()

model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

try:
    print("1️⃣ Downloading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    print("✅ Tokenizer downloaded")
    
    print("\n2️⃣ Downloading model (this is the large file)...")
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float32,
        device_map="cpu",
        low_cpu_mem_usage=True
    )
    print("✅ Model downloaded")
    
    print("\n3️⃣ Testing model with a simple prompt...")
    test_prompt = "Hello, how are you?"
    inputs = tokenizer(test_prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=20)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    print(f"   Prompt: {test_prompt}")
    print(f"   Response: {response}")
    
    print("\n" + "="*80)
    print("✅ TinyLlama download and test SUCCESSFUL!")
    print("="*80)
    print("Model is now cached and ready to use.")
    
except Exception as e:
    print(f"\n❌ Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
