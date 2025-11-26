import asyncio
import sys
import os
import json

# Add backend directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
sys.path.insert(0, backend_dir)

from core.agents.orchestrator import recommend_courses

# Sample user profile
sample_user = {
    "age": 20,
    "native_language": "Tamil",
    "preferred_language": "English",
    "ol_results": "Maths: A, Science: B, English: A, ICT: B",
    "al_stream": "Physical Science",
    "al_results": "Combined Maths: B, Chemistry: C, Physics: C",
    "other_qualifications": "",
    "ielts": "",
    "interest_area": "Software Engineering",
    "career_goal": "Software Engineer, Data Scientist",
    "income": "Medium",
    "study_method": "Full Time",
    "availability": "Weekdays",
    "completion_period": "4 years",
    "current_location": "Colombo",
    "preferred_locations": "Colombo",
}

print("🔬 Testing Agentic Course Recommendation System")
print("="*80)
print("\n📋 User Profile:")
print(f"   Age: {sample_user['age']}")
print(f"   Interest Area: {sample_user['interest_area']}")
print(f"   Career Goal: {sample_user['career_goal']}")
print(f"   A/L Stream: {sample_user['al_stream']}")
print(f"   Study Method: {sample_user['study_method']}")
print(f"   Location: {sample_user['current_location']}")
print("\n")


# Run recommendation pipeline
response = asyncio.run(recommend_courses(sample_user, initial_k=25, final_k=10, explain_top_n=5))

print("\n🔹 RAW JSON RESPONSE 🔹")
print(json.dumps(response, indent=4))

# Display results
print("\n" + "="*80)
print("📊 FINAL RECOMMENDATIONS")
print("="*80 + "\n")

if response["status"] == "error":
    print("❌ ERROR:")
    for err in response["errors"]:
        print(f"   - {err}")
    if response.get("warnings"):
        print("\n⚠️ WARNINGS:")
        for warn in response["warnings"]:
            print(f"   - {warn}")
else:
    if response.get("warnings"):
        print("⚠️ WARNINGS:")
        for warn in response["warnings"]:
            print(f"   - {warn}")
        print("-" * 80)

    results = response["results"]
    for i, r in enumerate(results, start=1):
        meta = r["metadata"]
        print("="*80)
        print(f"#{i} | {meta.get('course', 'Unknown Course')}")
        print("="*80)
        print(f"📈 Score: {r.get('score', 0):.2f}/100")
        print(f"🎯 Similarity Distance: {r['distance']:.4f}")
        print(f"🏫 Campus: {meta.get('campus', 'N/A')}")
        print(f"📍 Location: {meta.get('location', meta.get('campus', 'N/A'))}")
        print(f"⏱️  Duration: {meta.get('duration', 'N/A')}")
        print(f"📚 Department: {meta.get('department', 'N/A')}")
        
        if "explanation" in r:
            print(f"\n💡 Why this course?")
            print(f"   {r['explanation']}")
        
        print(f"\n🔗 URL: {meta.get('url', 'N/A')}")
        print()

print("="*80)
print("✅ Test Complete!")
print("="*80)
