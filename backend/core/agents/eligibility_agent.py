from typing import List, Dict, Any
import re

def has_al_eligibility(user: Dict[str, Any]) -> bool:
    """
    Check if user has completed A/L (has A/L results).
    
    Args:
        user: User profile dictionary
        
    Returns:
        True if user has A/L results, False otherwise
    """
    al_results = user.get("al_results") or user.get("alResults") or ""
    al_stream = user.get("al_stream") or user.get("alStream") or ""
    
    # User has A/L if they have results OR a valid stream (not null/None)
    has_results = bool(al_results and str(al_results).strip() and str(al_results).lower() != "null")
    has_stream = bool(al_stream and str(al_stream).strip() and str(al_stream).lower() != "null")
    
    return has_results or has_stream


def course_requires_al(course_meta: Dict[str, Any]) -> bool:
    """
    Check if course requires A/L qualification.
    
    Args:
        course_meta: Course metadata dictionary
        
    Returns:
        True if course requires A/L, False otherwise
    """
    # Build searchable text from course metadata
    text = " ".join([
        str(course_meta.get("course", "")),
        str(course_meta.get("Course", "")),
        str(course_meta.get("course_name", "")),
        str(course_meta.get("Entry Requirements", "")),
        str(course_meta.get("requirements", "")),
        str(course_meta.get("department", "")),
        str(course_meta.get("Department", "")),
    ]).lower()
    
    # Keywords that indicate A/L requirement
    al_keywords = [
        "a/l", "advanced level", "a level",
        "physical science", "combined mathematics",
        "physics", "chemistry", "biology",
        "commerce stream", "arts stream",
        "gce advanced"
    ]
    
    # Exemption keywords (courses that accept O/L or foundation)
    exemption_keywords = [
        "foundation", "diploma", "o/l only",
        "ordinary level sufficient", "certificate"
    ]
    
    # Check if it requires A/L
    requires_al = any(keyword in text for keyword in al_keywords)
    
    # Check if it has exemptions
    has_exemption = any(keyword in text for keyword in exemption_keywords)
    
    # Require A/L unless explicitly exempted
    # Also check course level indicators
    is_degree = any(word in text for word in ["bachelor", "degree", "bsc", "b.sc", "beng", "b.eng"])
    
    # Degrees typically require A/L unless stated otherwise
    if is_degree and not has_exemption:
        return True
    
    return requires_al and not has_exemption


def is_eligible_for_course(user: Dict[str, Any], course_meta: Dict[str, Any]) -> bool:
    """
    Check if user meets eligibility requirements for a course.
    Enforces A/L and IELTS requirements as HARD constraints.
    
    Args:
        user: User profile dictionary
        course_meta: Course metadata dictionary
        
    Returns:
        True if eligible, False otherwise
    """
    
    # 1. Check A/L Requirement (HARD GATE)
    # =====================================
    if course_requires_al(course_meta):
        if not has_al_eligibility(user):
            # STRICT: If course requires A/L and user doesn't have it, BLOCK
            return False
    
    entry_req = (course_meta.get("Entry Requirements") or "").lower()

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
    This is a HARD filter - ineligible courses are BLOCKED.
    
    Args:
        user: User profile
        candidates: List of course candidates from RAG
        
    Returns:
        Filtered list of eligible candidates
    """
    eligible = []
    blocked_by_al = []
    blocked_by_other = []
    
    for c in candidates:
        meta = c.get("metadata", {})
        
        # Check A/L requirement first
        if course_requires_al(meta) and not has_al_eligibility(user):
            blocked_by_al.append(c)
            continue
        
        # Check other eligibility requirements
        if is_eligible_for_course(user, meta):
            eligible.append(c)
        else:
            blocked_by_other.append(c)
    
    # Log A/L blocking for transparency
    if blocked_by_al:
        print(f"🛑 A/L Eligibility Gate: Blocked {len(blocked_by_al)} courses (A/L required but not provided)")
        course_names = [c.get("metadata", {}).get("course", "Unknown")[:60] for c in blocked_by_al[:3]]
        print(f"   Examples: {', '.join(course_names)}")
    
    if blocked_by_other:
        print(f"⚠️ Other Requirements: Blocked {len(blocked_by_other)} courses (IELTS/O-L requirements)")
    
    # STRICT: Do NOT return original if everything filtered out
    # This is academically correct behavior
    if not eligible:
        print("🚫 All candidates filtered out by eligibility requirements.")
        print("   This is correct behavior - user does not meet academic requirements.")
        return []
    
    return eligible
