import sys
import os

# Add backend directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
sys.path.insert(0, backend_dir)

from core.agents.orchestrator import recommend_courses

def run_test(name, user_profile):
    print("\n" + "="*80)
    print(f"🧪 TEST CASE: {name}")
    print("="*80)
    print(f"Profile: {user_profile}")
    print("-" * 40)
    
    response = recommend_courses(user_profile, initial_k=5, final_k=2, explain_top_n=1)
    
    if response["status"] == "error":
        print("\n❌ BLOCKED BY VALIDATION:")
        for err in response["errors"]:
            print(f"   - {err}")
    elif response.get("warnings"):
        print("\n⚠️ PASSED WITH WARNINGS:")
        for warn in response["warnings"]:
            print(f"   - {warn}")
        print(f"\n✅ Result: Got {len(response['results'])} recommendations")
    else:
        print("\n✅ PASSED CLEANLY")
        print(f"Result: Got {len(response['results'])} recommendations")

# ---------------------------------------------------------
# TEST CASES
# ---------------------------------------------------------

# 1. Underage User (Should Error)
run_test("Underage User (11 years old)", {
    "age": 11,
    "interest_area": "Coding",
    "preferred_locations": "Colombo"
})

# 2. Young User without A/L (Should Warn)
run_test("16 Year Old (No A/L)", {
    "age": 16,
    "interest_area": "IT",
    "preferred_locations": "Colombo",
    "al_results": ""
})

# 3. Invalid Location (Should Error)
run_test("Invalid Location (Dubai)", {
    "age": 20,
    "interest_area": "Business",
    "preferred_locations": "Dubai",
    "al_results": "3As"
})

# 4. 1-Year Degree Warning
run_test("1-Year Degree Request", {
    "age": 20,
    "interest_area": "IT",
    "preferred_locations": "Colombo",
    "completion_period": "1 year",
    "al_results": "3Bs"
})

# 5. Valid User (Should Pass)
run_test("Valid User", {
    "age": 21,
    "interest_area": "Cybersecurity",
    "preferred_locations": "Colombo",
    "completion_period": "4 years",
    "al_results": "3Cs",
    "study_method": "Full Time"
})
