"""
Career Intent Classifier - Maps career goals to allowed course domains
"""
from typing import List, Dict, Any


# Career to allowed course domains mapping
CAREER_DOMAIN_MAP = {
    "civil engineer": [
        "civil",
        "construction",
        "structural",
        "building services",
        "infrastructure",
        "transportation",
        "water resources",
        "environmental engineering",
        "geotechnical",
        "urban planning"
    ],
    "software engineer": [
        "software",
        "computer science",
        "information technology",
        "computing",
        "programming",
        "web development",
        "mobile development"
    ],
    "data scientist": [
        "data science",
        "data analytics",
        "machine learning",
        "artificial intelligence",
        "statistics",
        "computer science",
        "information technology"
    ],
    "mechanical engineer": [
        "mechanical",
        "automotive",
        "manufacturing",
        "industrial",
        "mechatronic",
        "robotics"
    ],
    "electrical engineer": [
        "electrical",
        "electronics",
        "telecommunication",
        "power",
        "control systems",
        "automation"
    ],
    "electronics engineer": [
        "electronics",
        "telecommunication",
        "embedded systems",
        "communication",
        "instrumentation"
    ],
    "computer engineer": [
        "computer engineering",
        "computer systems",
        "embedded systems",
        "hardware",
        "computer science",
        "software"
    ],
    "business analyst": [
        "business",
        "management",
        "information systems",
        "business analytics",
        "administration"
    ],
    "network engineer": [
        "network",
        "telecommunication",
        "cybersecurity",
        "information technology",
        "computer science"
    ],
    "teacher": [
        "education",
        "teaching",
        "pedagogy"
    ],
    "doctor": [
        "medicine",
        "medical",
        "healthcare",
        "biomedical"
    ],
    "architect": [
        "architecture",
        "building design",
        "urban planning"
    ],
    "agricultural engineer": [
        "agricultural",
        "agriculture",
        "agronomy",
        "plantation"
    ]
}


def infer_allowed_domains(career_goal: str) -> List[str]:
    """
    Infer allowed course domains based on career goal.
    
    Args:
        career_goal: User's career goal (e.g., "Civil Engineer")
        
    Returns:
        List of allowed domain keywords, empty if no match found
    """
    if not career_goal:
        return []
    
    career_goal_lower = career_goal.lower().strip()
    
    # Direct match
    if career_goal_lower in CAREER_DOMAIN_MAP:
        return CAREER_DOMAIN_MAP[career_goal_lower]
    
    # Fuzzy match - check if any key is contained in career goal
    for key, domains in CAREER_DOMAIN_MAP.items():
        if key in career_goal_lower or career_goal_lower in key:
            return domains
    
    # No match found
    return []


def matches_career_domain(career_goal: str, course_text: str) -> bool:
    """
    Check if a course matches the career domain.
    
    Args:
        career_goal: User's career goal
        course_text: Combined text from course name, department, career opportunities
        
    Returns:
        True if matches career domain, False otherwise
    """
    allowed_domains = infer_allowed_domains(career_goal)
    
    # If no specific domain mapping, allow all (permissive fallback)
    if not allowed_domains:
        return True
    
    course_text_lower = course_text.lower()
    
    # Check if any allowed domain keyword appears in course text
    return any(domain in course_text_lower for domain in allowed_domains)


def get_domain_penalty(user: Dict[str, Any], course_meta: Dict[str, Any]) -> float:
    """
    Calculate penalty score for courses that don't match career domain.
    
    Args:
        user: User profile with career_goal
        course_meta: Course metadata
        
    Returns:
        Penalty value (0 = no penalty, higher = more penalty)
    """
    career_goal = user.get("career_goal", "")
    
    # Build searchable course text
    course_text = " ".join([
        course_meta.get("course", ""),
        course_meta.get("Course", ""),
        course_meta.get("department", ""),
        course_meta.get("Department", ""),
        course_meta.get("Career Opportunities", ""),
    ])
    
    if matches_career_domain(career_goal, course_text):
        return 0.0  # No penalty - domain matches
    else:
        return 30.0  # Heavy penalty - domain mismatch


def get_career_alignment_info(career_goal: str) -> Dict[str, Any]:
    """
    Get information about career domain alignment.
    
    Args:
        career_goal: User's career goal
        
    Returns:
        Dictionary with alignment info
    """
    allowed_domains = infer_allowed_domains(career_goal)
    
    return {
        "career_goal": career_goal,
        "has_mapping": len(allowed_domains) > 0,
        "allowed_domains": allowed_domains,
        "domain_count": len(allowed_domains)
    }
