"""
Local CPU-Optimized Models using Transformers

This module provides two models optimized for CPU-only execution:
1. Gemma-2B-IT (google/gemma-2b-it) - Main reasoning & RAG synthesis
2. TinyLlama-1.1B-Chat - Explanation simplification & ELI5 formatting

Uses transformers library with CPU optimization.
"""

import os
from typing import Optional
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline


class LocalLLMClient:
    """
    Manages two local LLM models optimized for CPU execution:
    - Gemma-2B-IT: Complex reasoning, final answers, RAG synthesis
    - TinyLlama: Explanation simplification, summaries, user-friendly rewriting
    """
    
    def __init__(self):
        """Initialize the models lazily (load on first use)"""
        self._gemma_model = None
        self._gemma_tokenizer = None
        self._tinyllama_model = None
        self._tinyllama_tokenizer = None
        
        # Model identifiers
        self.gemma_model_name = "google/gemma-2b-it"
        self.tinyllama_model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
        
        # Force CPU usage
        self.device = "cpu"
        
        print("🧠 Local LLM Client initialized (models will load on first use)")
    
    @property
    def gemma(self):
        """
        Lazy-load Gemma-2B-IT model (primary reasoning model)
        
        Usage:
        - Complex reasoning
        - Final answers
        - RAG synthesis
        - Problem solving
        """
        if self._gemma_model is None:
            print(f"📥 Loading Gemma-2B-IT ({self.gemma_model_name})...")
            print("   Loading on CPU (this may take a moment)...")
            try:
                self._gemma_tokenizer = AutoTokenizer.from_pretrained(self.gemma_model_name)
                self._gemma_model = AutoModelForCausalLM.from_pretrained(
                    self.gemma_model_name,
                    torch_dtype=torch.float32,
                    device_map=self.device,
                    low_cpu_mem_usage=True
                )
                print("✅ Gemma-2B-IT loaded successfully")
            except Exception as e:
                print(f"❌ Failed to load Gemma: {e}")
                return None
        return self._gemma_model
    
    @property
    def gemma_tokenizer(self):
        """Get Gemma tokenizer (loads model if needed)"""
        if self._gemma_tokenizer is None:
            _ = self.gemma  # Trigger model loading
        return self._gemma_tokenizer
    
    @property
    def tinyllama(self):
        """
        Lazy-load TinyLlama-1.1B model (explanation model)
        
        Usage:
        - Explanation simplification
        - ELI5 formatting
        - Short summaries
        - User-friendly rewriting
        
        Note: Never use for reasoning or deep logic
        """
        if self._tinyllama_model is None:
            print(f"📥 Loading TinyLlama-1.1B ({self.tinyllama_model_name})...")
            print("   Loading on CPU...")
            try:
                self._tinyllama_tokenizer = AutoTokenizer.from_pretrained(self.tinyllama_model_name)
                self._tinyllama_model = AutoModelForCausalLM.from_pretrained(
                    self.tinyllama_model_name,
                    torch_dtype=torch.float32,
                    device_map=self.device,
                    low_cpu_mem_usage=True
                )
                print("✅ TinyLlama-1.1B loaded successfully")
            except Exception as e:
                print(f"❌ Failed to load TinyLlama: {e}")
                return None
        return self._tinyllama_model
    
    @property
    def tinyllama_tokenizer(self):
        """Get TinyLlama tokenizer (loads model if needed)"""
        if self._tinyllama_tokenizer is None:
            _ = self.tinyllama  # Trigger model loading
        return self._tinyllama_tokenizer
    
    def chat_gemma(
        self,
        prompt: str,
        system: str = "You are a helpful course advisor.",
        max_tokens: int = 300,
        temperature: float = 0.2
    ) -> str:
        """
        Send a chat request to Gemma-2B-IT (main reasoning model)
        
        Args:
            prompt: User message
            system: System message to set context
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0.0-1.0)
            
        Returns:
            Model response text
        """
        try:
            model = self.gemma
            tokenizer = self.gemma_tokenizer
            
            if model is None or tokenizer is None:
                return "(Gemma model not available)"
            
            # Format prompt for Gemma-2B-IT
            formatted_prompt = f"{system}\n\nUser: {prompt}\n\nAssistant:"
            
            inputs = tokenizer(formatted_prompt, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=max_tokens,
                    temperature=temperature,
                    do_sample=True,
                    pad_token_id=tokenizer.eos_token_id
                )
            
            response = tokenizer.decode(outputs[0], skip_special_tokens=True)
            # Remove the prompt from the response
            response = response.replace(formatted_prompt, "").strip()
            
            return response
        except Exception as e:
            print(f"⚠️ Gemma request failed: {e}")
            return f"(Gemma unavailable: {type(e).__name__})"
    
    def chat_tinyllama(
        self,
        prompt: str,
        system: str = "You are a helpful assistant that explains things simply.",
        max_tokens: int = 160,
        temperature: float = 0.3
    ) -> str:
        """
        Send a chat request to TinyLlama (explanation model)
        
        Args:
            prompt: User message
            system: System message to set context
            max_tokens: Maximum tokens in response (keep low for speed)
            temperature: Sampling temperature (0.0-1.0)
            
        Returns:
            Model response text
        """
        try:
            model = self.tinyllama
            tokenizer = self.tinyllama_tokenizer
            
            if model is None or tokenizer is None:
                return "(TinyLlama model not available)"
            
            # Format prompt for TinyLlama
            formatted_prompt = f"<|system|>\n{system}</s>\n<|user|>\n{prompt}</s>\n<|assistant|>\n"
            
            inputs = tokenizer(formatted_prompt, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=max_tokens,
                    temperature=temperature,
                    do_sample=True,
                    pad_token_id=tokenizer.eos_token_id
                )
            
            response = tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract only the assistant's response after the <|assistant|> tag
            # The model includes the full conversation in output
            if "<|assistant|>" in response:
                # Split at assistant tag and take everything after
                parts = response.split("<|assistant|>")
                if len(parts) > 1:
                    response = parts[-1].strip()
            else:
                # Fallback: remove the formatted prompt
                response = response.replace(formatted_prompt, "").strip()
            
            return response
        except Exception as e:
            print(f"⚠️ TinyLlama request failed: {e}")
            return f"(TinyLlama unavailable: {type(e).__name__})"


# Global client instance (singleton pattern)
_client = None


def get_airllm_client() -> LocalLLMClient:
    """
    Get or create the global Local LLM client instance
    
    Returns:
        Singleton LocalLLMClient instance
    """
    global _client
    if _client is None:
        _client = LocalLLMClient()
    return _client


def test_models():
    """Test both models for connectivity and basic functionality"""
    client = get_airllm_client()
    
    print("\n" + "="*60)
    print("Testing Gemma-2B-IT (Main Reasoning Model)")
    print("="*60)
    gemma_response = client.chat_gemma(
        "What is the capital of France?",
        system="You are a helpful assistant. Answer concisely."
    )
    print(f"✅ Gemma Response: {gemma_response}")
    
    print("\n" + "="*60)
    print("Testing TinyLlama-1.1B (Explanation Model)")
    print("="*60)
    tinyllama_response = client.chat_tinyllama(
        "Explain what a computer is in simple terms.",
        system="You are a helpful assistant that explains things simply."
    )
    print(f"✅ TinyLlama Response: {tinyllama_response}")
    
    print("="*60 + "\n")


if __name__ == "__main__":
    # Test the models when run directly
    test_models()
