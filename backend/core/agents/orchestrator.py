from typing import Dict, Any, List, Union
import sys
import os
import json

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(os.path.dirname(current_dir))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from core.rag.retriever import rag_search
from core.agents.eligibility_agent import filter_by_eligibility
from core.agents.filtering_agent import filter_candidates
from core.agents.ranking_agent import rank_candidates
from core.agents.explanation_agent import add_explanations
from core.validators.validation_layer import validate_user_profile

# Load course data globally for validation (locations)
# In a real app, this might be cached or loaded from DB
try:
    data_path = os.path.join(backend_dir, "data", "raw", "CourseData.json")
    with open(data_path, "r", encoding="utf-8") as f:
        LOADED_COURSES = json.load(f)
    AVAILABLE_LOCATIONS = list(set([c.get("Location", "") for c in LOADED_COURSES if c.get("Location")]))
except Exception as e:
    print(f"⚠️ Failed to load course data for validation: {e}")
    AVAILABLE_LOCATIONS = []


async def recommend_courses(user_input: Dict[str, Any],
                      initial_k: int = 25,
                      final_k: int = 10,
                      explain_top_n: int = 5) -> Dict[str, Any]:
    """
    Full agentic recommendation pipeline:
    1) Validation Layer (Pre-check)
    2) RAG retrieval (semantic search)
    3) Eligibility filtering (rule-based)
    4) Preference filtering (location, study method, duration)
    5) Intelligent ranking (distance + heuristics)
    6) LLM explanations (for top results)
    
    Args:
        user_input: User profile dictionary
        initial_k: Number of candidates to retrieve from RAG
        final_k: Number of final recommendations to return
        explain_top_n: Number of top courses to generate explanations for
        
    Returns:
        Dictionary with 'status', 'results', 'warnings', or 'errors'
    """
    
    print("="*80)
    print("🎯 AGENTIC COURSE RECOMMENDATION PIPELINE")
    print("="*80)
    
    # -------------------------
    # 1. VALIDATION LAYER
    # -------------------------
    print(f"\n🛡️ Step 0: Validating user profile...")
    validation = validate_user_profile(user_input, AVAILABLE_LOCATIONS)
    
    if validation["status"] == "error":
        print(f"❌ Validation failed: {validation['errors']}")
        return {
            "status": "error", 
            "errors": validation["errors"],
            "warnings": validation.get("warnings", [])
        }
        
    warnings = validation.get("warnings", [])
    if warnings:
        print(f"⚠️ Validation warnings: {warnings}")
    else:
        print("✅ Validation passed")
    
    # -------------------------
    # 2. RAG RETRIEVAL
    # -------------------------
    print(f"\n📚 Step 1: Retrieving top {initial_k} candidates using semantic search...")
    rag_results = rag_search(user_input, top_k=initial_k)
    print(f"   Retrieved {len(rag_results)} candidates")
    
    # -------------------------
    # 3. ELIGIBILITY FILTER
    # -------------------------
    print(f"\n✅ Step 2: Filtering by eligibility requirements...")
    eligible = filter_by_eligibility(user_input, rag_results)
    print(f"   {len(eligible)} candidates passed eligibility check")
    
    # -------------------------
    # 4. PREFERENCE FILTER
    # -------------------------
    print(f"\n🔍 Step 3: Filtering by user preferences (location, study method, duration)...")
    filtered = filter_candidates(user_input, eligible)
    print(f"   {len(filtered)} candidates match user preferences")
    
    # Fallback: if filters are too strict, use eligible results (or raw RAG)
    if not filtered:
        print("   ⚠️ Filters too strict - using eligible results as fallback")
        filtered = eligible if eligible else rag_results[:final_k]
        warnings.append("No courses matched all your preferences exactly, so we're showing the best available alternatives.")
    
    # -------------------------
    # 5. INTELLIGENT RANKING
    # -------------------------
    print(f"\n⭐ Step 4: Ranking candidates by combined score...")
    ranked = rank_candidates(user_input, filtered)
    print(f"   Ranked {len(ranked)} candidates")
    
    # Truncate to final_k
    # top_ranked = ranked[:final_k]
    # print(f"   Selected top {len(top_ranked)} courses")
    
    # -------------------------
    # 6. LLM EXPLANATIONS
    # -------------------------
    # print(f"\n💡 Step 5: Generating AI-powered explanations for top {explain_top_n} courses...")
    # Pass full 'ranked' list. add_explanations handles LLM for top_n and fallback for others.
    # final_results = await add_explanations(user_input, ranked, top_n=explain_top_n)
    
    print("="*80)
    print("✅ RECOMMENDATION PIPELINE COMPLETE")
    print("="*80 + "\n")
    
    return {
        "status": "success",
        "results": ranked,
        "warnings": warnings
    }
