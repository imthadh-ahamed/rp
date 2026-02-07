import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

try:
    from llm.hardware_utils import detect_gpu, should_use_gpu, get_system_info
except ImportError:
    from hardware_utils import detect_gpu, should_use_gpu, get_system_info

# Detect hardware on initialization
GPU_INFO = detect_gpu()
USE_GPU = should_use_gpu()
SYSTEM_INFO = get_system_info()

# Configuration for local vs production
# Set environment variable LLM_MODE to 'local' or 'production'
LLM_MODE = os.getenv("LLM_MODE", "production")  # Default to production for Gemini

# Local Docker Model Runner configuration
# Using Ollama with GPU on port 12435
LOCAL_BASE_URL = "http://localhost:12435/v1"
LOCAL_MODEL = "deepseek-r1:8b"

# Production Gemini configuration (OpenAI Compatible)
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def get_llm_config():
    """Get current LLM configuration with GPU settings"""
    # Prioritize Gemini if API key is present
    if GEMINI_API_KEY:
        return {
            "mode": "production",
            "base_url": GEMINI_BASE_URL,
            "model": GEMINI_MODEL,
            "api_key": GEMINI_API_KEY,
            "gpu_enabled": True,  # Cloud GPUs
            "gpu_info": "Cloud GPU (Gemini 2.5 Flash)"
        }
    elif LLM_MODE == "production":
         # Fallback if key missing but mode is production
        print("⚠️ GEMINI_API_KEY not found in .env file!")
        return {
            "mode": "production",
            "base_url": GEMINI_BASE_URL,
            "model": GEMINI_MODEL,
            "api_key": "missing-key",
            "gpu_enabled": True,
            "gpu_info": "Cloud GPU"
        }
    else:
        # Local: Use DeepSeek via Docker Model Runner
        return {
            "mode": "local",
            "base_url": LOCAL_BASE_URL,
            "model": LOCAL_MODEL,
            "api_key": "not-needed",
            "gpu_enabled": USE_GPU,
            "gpu_info": GPU_INFO if GPU_INFO["available"] else "CPU only"
        }


# Initialize OpenAI client based on configuration
config = get_llm_config()
client = OpenAI(
    base_url=config["base_url"],
    api_key=config["api_key"],
)

# Export model name for external use
DEEPSEEK_MODEL = config["model"]

# Print initialization info
print(f"🤖 LLM Client initialized:")
print(f"   Mode: {config['mode']}")
print(f"   Model: {config['model']}")
if config['mode'] == 'local':
    if USE_GPU:
        print(f"   🚀 GPU Acceleration: ENABLED")
        print(f"   GPU: {GPU_INFO['name']} ({GPU_INFO['memory_gb']} GB VRAM)")
    else:
        print(f"   🐢 GPU Acceleration: DISABLED (using CPU)")
else:
    print(f"   ☁️  Cloud GPU: ENABLED")


def chat(prompt: str, system: str = "You are a helpful course advisor.", timeout: int = 30) -> str:
    """
    Send a chat completion request to the LLM.
    Works with both local DeepSeek and production Gemini API.
    
    Args:
        prompt: User message
        system: System message to set context
        timeout: Request timeout in seconds
        
    Returns:
        LLM response text
    """
    try:
        # Prepare request parameters
        request_params = {
            "model": config["model"],
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            "max_tokens": 300,
            "temperature": 0.2,
            "timeout": timeout
        }

        # If local and GPU enabled, request layer offloading
        if config["mode"] == "local" and config["gpu_enabled"]:
            # n_gpu_layers = -1 means offload ALL layers to GPU
            request_params["extra_body"] = {"n_gpu_layers": -1}

        resp = client.chat.completions.create(**request_params)
        
        # Check if response is valid
        if resp and resp.choices and len(resp.choices) > 0:
            content = resp.choices[0].message.content
            if content:
                return content.strip()
        
        return "(LLM returned empty response)"
    except TimeoutError:
        print(f"⚠️ LLM request timed out after {timeout}s")
        return "(LLM request timed out - model may be loading or unresponsive)"
    except Exception as e:
        print(f"⚠️ LLM request failed: {e}")
        return f"(LLM unavailable: {type(e).__name__})"


def test_llm():
    """Test LLM connectivity"""
    print("\n" + "="*60)
    print("Testing LLM Connection...")
    print("="*60)
    response = chat("Say 'Hello' if you can hear me.", system="You are a helpful assistant.", timeout=15)
    print(f"✅ LLM Test Response: {response}")
    print("="*60)
    return response


if __name__ == "__main__":
    # Display hardware info and test the LLM
    print("\n" + "="*60)
    print("System Information")
    print("="*60)
    print(f"Platform: {SYSTEM_INFO['platform']}")
    print(f"Processor: {SYSTEM_INFO['processor']}")
    print(f"CPU Cores: {SYSTEM_INFO['cpu_cores']}")
    print(f"RAM: {SYSTEM_INFO['ram_gb']} GB")
    
    if GPU_INFO['available']:
        print(f"\nGPU: {GPU_INFO['name']}")
        print(f"VRAM: {GPU_INFO['memory_gb']} GB")
        print(f"Type: {GPU_INFO['type']}")
    
    test_llm()
