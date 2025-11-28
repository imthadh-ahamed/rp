import requests
import json

# CORRECT Docker Model Runner API endpoint for embeddings
url = "http://localhost:12434/engines/llama.cpp/v1/embeddings"

# OpenAI-compatible payload
payload = {
    "model": "ai/nomic-embed-text-v1.5:latest",
    "input": "Hello, this is a test message to check if the embedding model is working."
}

headers = {
    "Content-Type": "application/json"
}

print("="*70)
print("Testing Docker Model Runner - Embedding Model")
print("="*70)
print(f"\nEndpoint: {url}")
print(f"Model: {payload['model']}")
print(f"Input text: {payload['input'][:50]}...")
print("\n" + "="*70 + "\n")

try:
    print("Sending request...")
    response = requests.post(url, json=payload, headers=headers, timeout=60)
    
    print(f"Status Code: {response.status_code}\n")
    
    if response.status_code == 200:
        result = response.json()
        
        print("🎉 SUCCESS! The embedding model is working!\n")
        print("="*70)
        
        # Display response structure
        print(f"Response Keys: {list(result.keys())}\n")
        
        # Check for embeddings in OpenAI format
        if 'data' in result:
            data_items = result['data']
            print(f"Number of embeddings: {len(data_items)}")
            
            if len(data_items) > 0:
                first_item = data_items[0]
                print(f"First item keys: {list(first_item.keys())}")
                
                if 'embedding' in first_item:
                    embedding = first_item['embedding']
                    print(f"\nEmbedding Details:")
                    print(f"  - Dimension: {len(embedding)}")
                    print(f"  - Data type: {type(embedding[0]).__name__}")
                    print(f"  - First 5 values: {embedding[:5]}")
                    print(f"  - Last 5 values: {embedding[-5:]}")
                    print(f"  - Min value: {min(embedding):.6f}")
                    print(f"  - Max value: {max(embedding):.6f}")
        
        elif 'embeddings' in result:
            embeddings = result['embeddings']
            print(f"Number of embeddings: {len(embeddings)}")
            if len(embeddings) > 0:
                embedding = embeddings[0]
                print(f"\nEmbedding Details:")
                print(f"  - Dimension: {len(embedding)}")
                print(f"  - First 5 values: {embedding[:5]}")
        
        print("\n" + "="*70)
        print("Sample Response (truncated):")
        print("="*70)
        response_str = json.dumps(result, indent=2)
        if len(response_str) > 1000:
            print(response_str[:1000] + "\n... (truncated)")
        else:
            print(response_str)
            
    else:
        print(f"❌ ERROR: HTTP {response.status_code}")
        print(f"\nResponse Body:")
        print(response.text)
        
        if response.status_code == 404:
            print("\n💡 Troubleshooting:")
            print("  1. Make sure the model is loaded: docker model run ai/nomic-embed-text-v1.5:latest")
            print("  2. Check if Docker Desktop Model Runner is enabled")
            print("  3. Verify the service is running on port 12434")
        
except requests.exceptions.ConnectionError as e:
    print("❌ CONNECTION ERROR")
    print(f"\nCould not connect to {url}")
    print("\n💡 Possible issues:")
    print("  1. Docker Desktop is not running")
    print("  2. Model Runner service is not started")
    print("  3. Port 12434 is not accessible")
    print(f"\nError details: {str(e)}")
    
except requests.exceptions.Timeout:
    print("❌ TIMEOUT ERROR")
    print("The request took longer than 60 seconds.")
    print("The model might be loading for the first time (this can take a while).")
    
except Exception as e:
    print(f"❌ UNEXPECTED ERROR: {type(e).__name__}")
    print(f"Details: {str(e)}")

print("\n" + "="*70)
