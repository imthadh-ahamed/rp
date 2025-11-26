from typing import List, Dict, Any

def matches_location(user: Dict[str, Any], course_meta: Dict[str, Any]) -> bool:
    """
    Check if course location matches user's preferred locations.
    
    Args:
        user: User profile
        course_meta: Course metadata
        
    Returns:
        True if location matches or no preference specified
    """
    pref = (user.get("preferred_locations") or "").lower()
    if not pref or pref == "n/a":
        return True
    
    course_loc = (course_meta.get("location") or course_meta.get("campus") or "").lower()
    
    # Simple contains check - if any preferred location is in course location
    return any(p.strip() in course_loc for p in pref.split(","))


def matches_study_method(user: Dict[str, Any], course_meta: Dict[str, Any]) -> bool:
    """
    Check if course study method matches user's preference.
    
    Args:
        user: User profile
        course_meta: Course metadata
        
    Returns:
        True if study method matches or no preference specified
    """
    pref_method = (user.get("study_method") or "").lower()
    if not pref_method or pref_method == "n/a":
        return True
    
    course_method = (course_meta.get("study_method") or "").lower()
    
    # Check if user's preferred method is in the course's study method
    return pref_method in course_method or course_method in pref_method


def matches_duration(user: Dict[str, Any], course_meta: Dict[str, Any]) -> bool:
    """
    Check if course duration aligns with user's completion period preference.
    
    Args:
        user: User profile
        course_meta: Course metadata
        
    Returns:
        True if duration matches or no preference specified
    """
    pref_period = (user.get("completion_period") or "").lower()
    if not pref_period or pref_period == "n/a":
        return True
    
    duration = (course_meta.get("duration") or "").lower()
    
    # Extract years from both strings (rough matching)
    # This is simplified - can be enhanced with better parsing
    if "1 year" in pref_period and "1 year" in duration:
        return True
    if ("3" in pref_period or "4" in pref_period) and ("3" in duration or "4" in duration):
        return True
    
    # Default to True to be lenient
    return True


def filter_candidates(user: Dict[str, Any],
                      candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Filter candidates based on user preferences (location, study method, duration).
    
    Args:
        user: User profile
        candidates: List of course candidates
        
    Returns:
        Filtered list of candidates matching user preferences
    """
    filtered = []
    
    for c in candidates:
        meta = c.get("metadata", {})
        
        # Apply all filters
        if not matches_location(user, meta):
            continue
        if not matches_study_method(user, meta):
            continue
        if not matches_duration(user, meta):
            continue
        
        filtered.append(c)
    
    # If filters are too strict and nothing passes, return original
    if not filtered:
        print("⚠️ All candidates filtered out by preferences. Returning original list.")
        return candidates
    
    return filtered
