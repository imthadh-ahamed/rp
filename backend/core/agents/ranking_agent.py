from typing import List, Dict, Any

def compute_score(user: Dict[str, Any], candidate: Dict[str, Any]) -> float:
    """
    Combine vector distance + heuristics into a single score (0-100).
    Higher score = better match.
    
    Args:
        user: User profile
        candidate: Course candidate with distance and metadata
        
    Returns:
        Score from 0-100 (higher is better)
    """
    dist = float(candidate["distance"])
    meta = candidate["metadata"]
    
    # Build searchable course text
    course_text = " ".join([
        meta.get("course", ""),
        meta.get("department", ""),
        meta.get("Career Opportunities") or "",
    ]).lower()
    
    # Get user preferences
    interest = (user.get("interest_area") or "").lower()
    career_goal = (user.get("career_goal") or "").lower()
    
    # Base score from cosine distance (0.0 = perfect match, 1.0 = worst)
    # Convert to similarity: 1.0 - distance
    similarity = 1.0 - dist
    score = similarity * 70  # Up to 70 points from RAG similarity
    
    # Bonus 1: Interest area match
    if interest:
        # Check if main interest keyword appears in course
        interest_keywords = interest.split()
        for keyword in interest_keywords:
            if len(keyword) > 3 and keyword in course_text:
                score += 10
                break
    
    # Bonus 2: Career goal alignment
    if career_goal:
        # Check if career keywords appear in course career opportunities
        career_keywords = career_goal.split()
        for keyword in career_keywords:
            if len(keyword) > 3 and keyword in course_text:
                score += 10
                break
    
    # Bonus 3: Study method match
    user_method = (user.get("study_method") or "").lower()
    course_method = (meta.get("study_method") or "").lower()
    if user_method and user_method in course_method:
        score += 5
    
    # Bonus 4: Location match
    user_locations = (user.get("preferred_locations") or "").lower()
    course_location = (meta.get("campus") or "").lower()
    if user_locations and any(loc.strip() in course_location for loc in user_locations.split(",")):
        score += 5
    
    # Clamp score to 0-100 range
    return max(0.0, min(100.0, score))


def rank_candidates(user: Dict[str, Any],
                    candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Compute scores for all candidates and sort by score (descending).
    
    Args:
        user: User profile
        candidates: List of course candidates
        
    Returns:
        Sorted list of candidates with 'score' field added
    """
    # Compute score for each candidate
    for c in candidates:
        c["score"] = compute_score(user, c)
    
    # Sort by score (descending - highest first)
    ranked = sorted(candidates, key=lambda x: x["score"], reverse=True)
    
    return ranked
