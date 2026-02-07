from typing import List, Dict, Any
from core.agents.career_intent import matches_career_domain


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
    
    # Get location from metadata (falls back to campus if location not available)
    course_loc = (course_meta.get("location") or course_meta.get("campus") or "").lower()
    
    # Debug logging
    print(f"🔍 Location match - User pref: '{pref}', Course loc: '{course_loc}', Match: {any(p.strip() in course_loc for p in pref.split(','))}")
    
    # Split course location by / or , to handle multi-location strings like "Colombo/Kandy/Matara"
    course_locations = [loc.strip() for loc in course_loc.replace('/', ',').split(',')]
    
    # Check if any user preferred location matches any course location
    for user_loc in pref.split(","):
        user_loc = user_loc.strip()
        for course_location in course_locations:
            if user_loc in course_location or course_location in user_loc:
                return True
    
    return False


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
    
    # Handle synonyms: "onsite" = "full time", "online" = "distance/part time"
    onsite_keywords = ["onsite", "full time", "full-time", "fulltime"]
    online_keywords = ["online", "distance", "part time", "part-time", "parttime"]
    
    # Check if user wants onsite and course offers it
    if any(keyword in pref_method for keyword in onsite_keywords):
        if any(keyword in course_method for keyword in onsite_keywords):
            return True
    
    # Check if user wants online and course offers it
    if any(keyword in pref_method for keyword in online_keywords):
        if any(keyword in course_method for keyword in online_keywords):
            return True
    
    # Fallback: direct substring match
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


def matches_career_domain_filter(user: Dict[str, Any], course_meta: Dict[str, Any]) -> bool:
    """
    Check if course domain aligns with user's career goal.
    This is a HARD filter to ensure career relevance.
    
    Args:
        user: User profile
        course_meta: Course metadata
        
    Returns:
        True if domain matches or no career goal specified
    """
    career_goal = user.get("career_goal", "")
    
    # If no career goal, allow all courses
    if not career_goal:
        return True
    
    # Build searchable course text
    course_text = " ".join([
        course_meta.get("course", ""),
        course_meta.get("Course", ""),
        course_meta.get("department", ""),
        course_meta.get("Department", ""),
        course_meta.get("Career Opportunities", ""),
    ])
    
    return matches_career_domain(career_goal, course_text)


def filter_candidates(user: Dict[str, Any],
                      candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Filter candidates based on user preferences (location, study method, duration, career domain).
    
    Args:
        user: User profile
        candidates: List of course candidates
        
    Returns:
        Filtered list of candidates matching user preferences
    """
    filtered = []
    excluded_by_domain = []
    
    for c in candidates:
        meta = c.get("metadata", {})
        
        # Apply career domain filter first (HARD constraint)
        if not matches_career_domain_filter(user, meta):
            excluded_by_domain.append(c)
            continue
            
        # Apply other filters (soft constraints)
        if not matches_location(user, meta):
            continue
        if not matches_study_method(user, meta):
            continue
        if not matches_duration(user, meta):
            continue
        
        filtered.append(c)
    
    # Log career domain filtering for transparency
    if excluded_by_domain:
        career_goal = user.get("career_goal", "")
        print(f"🎯 Career Domain Filter: Excluded {len(excluded_by_domain)} courses not matching '{career_goal}'")
        print(f"   Examples: {', '.join([c.get('metadata', {}).get('course', 'Unknown')[:50] for c in excluded_by_domain[:3]])}")
    
    # If filters are too strict and nothing passes, return career-filtered results only
    if not filtered and excluded_by_domain:
        print("⚠️ Location/study filters too strict. Returning career-relevant courses only.")
        return [c for c in candidates if matches_career_domain_filter(user, c.get("metadata", {}))]
    
    # If even career filter removed everything, return original (failsafe)
    if not filtered:
        print("⚠️ All candidates filtered out. Returning original list as failsafe.")
        return candidates
    
    return filtered
