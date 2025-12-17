"""Test TinyLlama explanations in isolation"""
import asyncio
import sys
import os

# Add backend directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
sys.path.insert(0, backend_dir)

from core.agents.explanation_agent import add_explanations

# Sample user profile
sample_user = {
    "interest_area": "Software Engineering",
    "career_goal": "Software Engineer, Data Scientist",
    "preferred_locations": "Colombo",
}

# Sample ranked courses (top 3 for quick test)
ranked_courses = [
    {
        "distance": 0.1612,
        "score": 78.91,
        "metadata": {
            "course": "BSc (Hons) Software Engineering Degree",
            "campus": "Saeigs",
            "location": "Saeigs",
            "duration": "4 Years",
            "department": "Faculty of Information Technology",
            "url": "https://saegis.ac.lk/degree-program/20",
        }
    },
    {
        "distance": 0.1740,
        "score": 77.82,
        "metadata": {
            "course": "Bachelor of Science (Honours) in Software Engineering",
            "campus": "ICBT",
            "location": "ICBT",
            "duration": "4 Years",
            "department": "Information Technology",
            "url": "https://icbt.lk/courses/bachelor",
        }
    },
    {
        "distance": 0.1749,
        "score": 77.76,
        "metadata": {
            "course": "BSc (Hons) in Software Engineering",
            "campus": "KIU",
            "location": "KIU",
            "duration": "3–4 Years",
            "department": "Faculty of Computer Science and Engineering",
            "url": "https://kiu.ac.lk/faculty/computer",
        }
    }
]

print("🧪 Testing TinyLlama Explanation Generation")
print("="*80)
print(f"User Profile: {sample_user['interest_area']} → {sample_user['career_goal']}")
print(f"Testing on {len(ranked_courses)} courses...")
print()

async def main():
    print("Starting explanation generation...")
    results = await add_explanations(sample_user, ranked_courses, top_n=3)
    
    print("\n" + "="*80)
    print("RESULTS")
    print("="*80 + "\n")
    
    for i, course in enumerate(results, start=1):
        print(f"#{i} | {course['metadata']['course']}")
        print(f"Score: {course['score']:.2f}/100")
        print(f"\nExplanation ({len(course.get('explanation', ''))} chars):")
        print(f"{course.get('explanation', 'NO EXPLANATION')}")
        print("\n" + "-"*80 + "\n")
    
    # Check if we got AI explanations or fallbacks
    ai_count = sum(1 for c in results if "aligns well with your interest in" not in c.get('explanation', ''))
    print(f"\n✅ AI-generated explanations: {ai_count}/{len(results)}")
    print(f"📝 Fallback explanations: {len(results) - ai_count}/{len(results)}")

asyncio.run(main())
