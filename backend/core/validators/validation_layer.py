from typing import Dict, List, Any

def validate_user_profile(user: Dict[str, Any], available_locations: List[str]) -> Dict[str, Any]:
    """
    Runs BEFORE RAG/Agents.
    If any blocking issue is found, return {"errors": [...]}.
    If minor issues, return {"warnings": [...]}.
    Else return {"status": "ok"}.
    
    Args:
        user: User profile dictionary
        available_locations: List of available course locations/campuses
        
    Returns:
        Validation result dictionary
    """

    errors = []
    warnings = []

    # -------------------
    # AGE CHECK
    # -------------------
    try:
        age_val = user.get("age")
        if age_val is None or age_val == "":
            age = 0
        else:
            age = int(age_val)
    except (ValueError, TypeError):
        age = 0

    if age > 0 and age < 12:
        errors.append("The minimum age for any academic program is 12+. Please re-check your age.")
    elif age > 0 and age < 15:
        errors.append("You are too young for degree programs. Only foundation or school-level programs apply.")
    elif age > 0 and age < 18:
        warnings.append("Most degree programs require completed A/Ls. If you don't have A/L results, only Diplomas or Foundations are possible.")

    # -------------------
    # A/L REQUIREMENT
    # -------------------
    al_results = user.get("al_results") or user.get("alResults") or ""
    has_al = len(str(al_results).strip()) > 0

    if not has_al and age >= 18:
        warnings.append("You did not provide A/L results. Many degrees require A/L or equivalent qualifications.")

    # -------------------
    # LOCATION CHECK
    # -------------------
    preferred_location = (user.get("preferred_locations") or "").lower()

    if preferred_location and preferred_location != "n/a":
        # Normalize available locations for comparison
        # Extract unique cities/campuses from the list
        normalized_available = set()
        for loc in available_locations:
            if loc:
                # Split by comma if multiple locations listed
                parts = str(loc).lower().split(',')
                for part in parts:
                    normalized_available.add(part.strip())
        
        # Check if any preferred location matches available locations
        # We use a lenient check: if any preferred loc is a substring of any available loc
        found_match = False
        pref_list = [p.strip() for p in preferred_location.split(',')]
        
        for pref in pref_list:
            if any(pref in avail for avail in normalized_available):
                found_match = True
                break
        
        if not found_match:
            # Get a few sample locations to suggest
            sample_locs = sorted(list(normalized_available))[:5]
            sample_str = ", ".join([s.title() for s in sample_locs])
            
            errors.append(
                f"No degree programs are available in your preferred location: {preferred_location}. "
                f"Available locations include: {sample_str}, etc."
            )

    # -------------------
    # STUDY DURATION CHECK
    # -------------------
    duration = (user.get("completion_period") or "").lower()

    if duration in ["1 year", "one year", "under 1 year", "1"]:
        warnings.append("Most full bachelor's degrees take 3–4 years. A 1-year duration suggests a diploma, top-up, or certificate program.")

    # -------------------
    # RETURN RESULT
    # -------------------
    if errors:
        return {"status": "error", "errors": errors, "warnings": warnings}

    return {"status": "ok", "warnings": warnings}
