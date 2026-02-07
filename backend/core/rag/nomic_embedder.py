"""
Nomic Embedding Generator

Uses nomic-ai/nomic-embed-text-v1.5 for semantic embeddings.
Produces 768-dimensional vectors optimized for:
- Semantic search
- Relevancy ranking
- RAG retrieval

Note: This model is for embeddings only, NOT for text generation.
"""

import os
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import Union, List


class NomicEmbedder:
    """
    Nomic-Embed-Text-v1.5 embedding generator
    
    Produces 768-dimension vectors for semantic search and RAG retrieval.
    """
    
    def __init__(self, model_name: str = "nomic-ai/nomic-embed-text-v1.5"):
        """
        Initialize the Nomic embedding model
        
        Args:
            model_name: HuggingFace model identifier
        """
        self.model_name = model_name
        print(f"📥 Loading embedding model: {model_name}...")
        self.model = SentenceTransformer(model_name, trust_remote_code=True)
        print(f"✅ Embedding model loaded (dimension: 768)")
    
    def normalize(self, vector: Union[np.ndarray, List[float]]) -> List[float]:
        """
        Normalize embedding vector for better similarity matching
        
        Args:
            vector: Input vector (numpy array or list)
            
        Returns:
            Normalized vector as list
        """
        v = np.array(vector)
        norm = np.linalg.norm(v)
        if norm == 0:
            return v.tolist()
        return (v / norm).tolist()
    
    def embed(self, text: str, normalize: bool = True) -> List[float]:
        """
        Generate embedding for a single text
        
        Args:
            text: Input text to embed
            normalize: Whether to normalize the output vector
            
        Returns:
            768-dimensional embedding vector
        """
        try:
            # Generate embedding
            embedding = self.model.encode(
                text,
                convert_to_tensor=False,
                normalize_embeddings=normalize
            )
            
            vector = embedding.tolist()
            
            # Additional normalization if requested and not already done
            if normalize and not self.model.encode.__defaults__:
                vector = self.normalize(vector)
            
            return vector
            
        except Exception as e:
            print(f"⚠️ Error generating embedding: {e}")
            return []
    
    def embed_batch(
        self,
        texts: List[str],
        normalize: bool = True,
        batch_size: int = 32
    ) -> List[List[float]]:
        """
        Generate embeddings for multiple texts (batched for efficiency)
        
        Args:
            texts: List of input texts
            normalize: Whether to normalize output vectors
            batch_size: Number of texts to process at once
            
        Returns:
            List of 768-dimensional embedding vectors
        """
        try:
            # Generate embeddings in batches
            embeddings = self.model.encode(
                texts,
                convert_to_tensor=False,
                normalize_embeddings=normalize,
                batch_size=batch_size,
                show_progress_bar=True
            )
            
            # Convert to list format
            vectors = [emb.tolist() for emb in embeddings]
            
            return vectors
            
        except Exception as e:
            print(f"⚠️ Error generating batch embeddings: {e}")
            return []
    
    def get_dimension(self) -> int:
        """Get the embedding dimension (should be 768 for Nomic)"""
        return self.model.get_sentence_embedding_dimension()


# Global embedder instance (singleton pattern)
_embedder = None


def get_nomic_embedder() -> NomicEmbedder:
    """
    Get or create the global Nomic embedder instance
    
    Returns:
        Singleton NomicEmbedder instance
    """
    global _embedder
    if _embedder is None:
        _embedder = NomicEmbedder()
    return _embedder


def embed_text(text: str, normalize: bool = True) -> List[float]:
    """
    Convenience function to embed a single text
    
    Args:
        text: Input text
        normalize: Whether to normalize the vector
        
    Returns:
        768-dimensional embedding vector
    """
    embedder = get_nomic_embedder()
    return embedder.embed(text, normalize=normalize)


def embed_texts(texts: List[str], normalize: bool = True, batch_size: int = 32) -> List[List[float]]:
    """
    Convenience function to embed multiple texts
    
    Args:
        texts: List of input texts
        normalize: Whether to normalize vectors
        batch_size: Batch size for processing
        
    Returns:
        List of 768-dimensional embedding vectors
    """
    embedder = get_nomic_embedder()
    return embedder.embed_batch(texts, normalize=normalize, batch_size=batch_size)


if __name__ == "__main__":
    # Test the embedder
    print("\n" + "="*60)
    print("Testing Nomic Embedder")
    print("="*60)
    
    embedder = get_nomic_embedder()
    
    # Test single embedding
    test_text = "This is a test course about computer science and programming."
    embedding = embedder.embed(test_text)
    
    print(f"Text: {test_text}")
    print(f"Embedding dimension: {len(embedding)}")
    print(f"First 5 values: {embedding[:5]}")
    print(f"Model dimension: {embedder.get_dimension()}")
    
    # Test batch embedding
    test_texts = [
        "Computer Science degree program",
        "Business Administration course",
        "Engineering and Technology studies"
    ]
    
    embeddings = embedder.embed_batch(test_texts)
    print(f"\nBatch embedding test: {len(embeddings)} texts embedded")
    print(f"Each embedding dimension: {len(embeddings[0])}")
    
    print("="*60 + "\n")
