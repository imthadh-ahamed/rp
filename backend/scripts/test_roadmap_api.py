"""
Test script for the new Agentic RAG Roadmap Generation API

This demonstrates how to call the /roadmap/generate endpoint
with a user profile and selected course to get a personalized roadmap.
"""
import requests
import json

# API Configuration
BASE_URL = "http://localhost:8000"
ROADMAP_ENDPOINT = f"{BASE_URL}/roadmap/generate"

# Sample request payload
sample_request = {
    "user_profile": {
        "age": "20",
        "gender": "Male",
        "nativeLanguage": "Tamil",
        "preferredLanguage": "English",
        "olResults": "Maths: A, English: B, Science: B, ICT: A",
        "alStream": "Physical Science",
        "alResults": "Combined Maths: B, Physics: B, Chemistry: B",
        "otherQualifications": None,
        "ieltsScore": 6,
        "interestArea": "Information Technology",
        "careerGoal": "Software Engineer or Data Engineer",
        "monthlyIncome": "45000 LKR",
        "fundingMethod": "Self-funded",
        "availability": "Weekday",
        "completionPeriod": "3-4 years",
        "studyMethod": "Onsite",
        "currentLocation": "Colombo, Sri Lanka",
        "preferredLocations": "Colombo, Sri Lanka"
    },
    "selected_course": {
        "course_name": "Bachelor of Software Engineering Honours",
        "university": "NSBM Green University",
        "location": "Pitipana, Homagama",
        "match_score": 85.5,
        "explanation": "This Bachelor of Software Engineering Honours at NSBM is well-suited for students interested in Information Technology pursuing careers in Software Engineer or Data Engineer. The program offers Full Time over 3-4 Years and provides comprehensive training leading to opportunities in various career paths.",
        "url": "https://nsbm.ac.lk/programme/bachelor-of-software-engineering-honours/",
        "career_opportunities": "Software Engineer, System Analyst, Software Architect, Quality Assurance Engineer, Project Manager, IT Consultant, Full Stack Developer, DevOps Engineer",
        "study_language": "English",
        "study_method": "Full Time",
        "duration": "3-4 Years",
        "requirements": "Applicants should meet the general admission requirements. Students with GCE A/L qualifications in Physical Science or Technology stream are preferred. Good knowledge of mathematics and logical thinking is essential.",
        "course_fee": "Rs.850,000.00 per year",
        "department": "School of Computing",
    }
}


def test_health_check():
    """Test the health check endpoint"""
    print("🏥 Testing health check...")
    response = requests.get(f"{BASE_URL}/roadmap/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()


def test_roadmap_generation():
    """Test the main roadmap generation endpoint"""
    print("🗺️ Testing roadmap generation...")
    print(f"Request payload:")
    print(json.dumps(sample_request, indent=2))
    print()
    
    response = requests.post(
        ROADMAP_ENDPOINT,
        json=sample_request,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ Roadmap Generated Successfully!")
        print(f"Status: {result['status']}")
        print(f"Stages: {len(result['roadmap'])}")
        
        # Display metadata
        if result.get('metadata'):
            print(f"\n📊 Metadata:")
            for key, value in result['metadata'].items():
                print(f"  {key}: {value}")
        
        # Display warnings
        if result.get('warnings'):
            print(f"\n⚠️ Warnings:")
            for warning in result['warnings']:
                print(f"  - {warning}")
        
        # Display first stage as example
        if result['roadmap']:
            stage1 = result['roadmap'][0]
            print(f"\n📖 Stage 1 Example:")
            print(f"  Title: {stage1['title']}")
            print(f"  Goal: {stage1['goal']}")
            print(f"  Duration: {stage1['duration']}")
            print(f"  Action Items: {len(stage1['actionPlan'])}")
            print(f"  Resources: {len(stage1['resources'])}")
            print(f"  Success Criteria: {len(stage1['successCriteria'])}")
        
        # Save full response to file
        with open('roadmap_response.json', 'w') as f:
            json.dump(result, f, indent=2)
        print(f"\n💾 Full response saved to roadmap_response.json")
    
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)


def test_different_career_goals():
    """Test with different career goals"""
    career_goals = [
        "Software Engineer",
        "Data Engineer",
        "Full Stack Developer",
        "DevOps Engineer",
        "Machine Learning Engineer"
    ]
    
    print("🎯 Testing different career goals...")
    
    for goal in career_goals:
        print(f"\nTesting: {goal}")
        test_request = sample_request.copy()
        test_request["career_goal"] = goal
        
        response = requests.post(
            ROADMAP_ENDPOINT,
            json=test_request,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"  ✅ Generated {len(result['roadmap'])} stages")
            if result.get('metadata'):
                print(f"  Priority skills: {result['metadata'].get('priority_skills', [])}")
        else:
            print(f"  ❌ Failed: {response.status_code}")


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Agentic RAG Roadmap Generation API Test")
    print("=" * 60)
    print()
    
    try:
        # Test 1: Health check
        test_health_check()
        
        # Test 2: Main roadmap generation
        test_roadmap_generation()
        
        # Test 3: Different career goals (optional, comment out if too slow)
        # test_different_career_goals()
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Make sure the server is running:")
        print("   python -m uvicorn api.main:app --reload")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
