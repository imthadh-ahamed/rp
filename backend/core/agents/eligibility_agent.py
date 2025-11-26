from typing import List, Dict, Any
import re

def is_eligible_for_course(user: Dict[str, Any], course_meta: Dict[str, Any]) -> bool:
    """
    Check if user meets eligibility requirements for a course.
    Enforces A/L and IELTS requirements.
    
    Args:
        user: User profile dictionary
        course_meta: Course metadata dictionary
        
    Returns:
        True if eligible, False otherwise
    """
    
    entry_req = (course_meta.get("Entry Requirements") or "").lower()
    
    # 1. Check A/L Requirement
    # ------------------------
    user_al = (user.get("al_results") or user.get("alResults") or "").lower()
    user_al_stream = (user.get("al_stream") or "").lower()
    has_al = len(user_al.strip()) > 0 or len(user_al_stream.strip()) > 0

    # If course explicitly requires A/L (and not just O/L)
    if ("a/l" in entry_req or "advanced level" in entry_req) and not has_al:
        # Check if it allows foundation/alternative
        if "foundation" not in entry_req and "equivalent" not in entry_req:
            return False

    # 2. Check IELTS Requirement
    # -------------------------
    if "ielts" in entry_req:
        # Extract required score if present (e.g., "IELTS 6.0")
        required_score = 5.0 # Default minimum
        match = re.search(r'ielts.*?(\d+\.?\d*)', entry_req)
        if match:
            try:
                required_score = float(match.group(1))
            except ValueError:
                pass
        
        user_ielts_str = str(user.get("ielts") or user.get("ielts_score") or "0")
        # Extract number from user string
        user_score_match = re.search(r'(\d+\.?\d*)', user_ielts_str)
        
        if user_score_match:
            try:
                user_score = float(user_score_match.group(1))
                if user_score < required_score:
                    return False
            except ValueError:
                pass
        elif "ielts" in entry_req and not user_ielts_str:
             # Course requires IELTS but user didn't provide it
             # Strict check: return False? Or be lenient?
             # For now, let's be strict if it's a clear requirement
             pass 

    # 3. Check O/L Requirement
    # -----------------------
    if "o/l" in entry_req or "ordinary level" in entry_req:
        user_ol = (user.get("ol_results") or "").lower()
        if not user_ol:
            # If O/L required but not provided
            return False
            
    return True


def filter_by_eligibility(user: Dict[str, Any],
                          candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Filter course candidates based on eligibility requirements.
    
    Args:
        user: User profile
        candidates: List of course candidates from RAG
        
    Returns:
        Filtered list of eligible candidates
    """
    eligible = []
    for c in candidates:
        meta = c.get("metadata", {})
        if is_eligible_for_course(user, meta):
            eligible.append(c)
        else:
            # Mark as ineligible but keep for logging/debugging if needed
            c["eligible"] = False
    
    # If all filtered out, return original (be lenient fallback)
    # BUT log a warning
    if not eligible:
        print("⚠️ All candidates filtered out by eligibility. Returning original list (fallback).")
        return candidates
    
    return eligible
