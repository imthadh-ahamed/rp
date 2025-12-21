"""
Test script for career domain filtering
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.agents.career_intent import (
    infer_allowed_domains, 
    matches_career_domain,
    get_domain_penalty,
    get_career_alignment_info
)

# Test cases
test_cases = [
    {
        "career_goal": "Civil engineer",
        "courses": [
            "Bachelor of Science Honours in Engineering – Civil Engineering",
            "Bachelor of Software Engineering Honours",
            "BSc (Hons) in Computer Science",
            "Building Services Engineering",
            "BSc Engineering (Hons) in Mechanical Engineering"
        ]
    },
    {
        "career_goal": "Software Engineer",
        "courses": [
            "Bachelor of Software Engineering Honours",
            "BSc (Hons) in Information Technology",
            "Bachelor of Science Honours in Engineering – Civil Engineering",
            "BSc (Hons) Computer Science Degree"
        ]
    }
]

print("=" * 80)
print("CAREER DOMAIN FILTERING TEST")
print("=" * 80)

for test in test_cases:
    career = test["career_goal"]
    print(f"\n🎯 Career Goal: {career}")
    print(f"   Allowed Domains: {infer_allowed_domains(career)}")
    print(f"\n   Course Analysis:")
    
    for course in test["courses"]:
        matches = matches_career_domain(career, course)
        status = "✅ MATCH" if matches else "❌ FILTERED"
        print(f"   {status}: {course}")

print("\n" + "=" * 80)
print("Career Alignment Info:")
print("=" * 80)

for goal in ["Civil engineer", "Software Engineer", "Data Scientist", "Unknown Role"]:
    info = get_career_alignment_info(goal)
    print(f"\n{goal}:")
    print(f"  Has Mapping: {info['has_mapping']}")
    print(f"  Domain Count: {info['domain_count']}")
    if info['allowed_domains']:
        print(f"  Domains: {', '.join(info['allowed_domains'][:5])}...")
