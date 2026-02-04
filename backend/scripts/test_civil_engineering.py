"""
Test Roadmap API with Civil Engineering Career Goal
"""
import requests
import json

API_BASE = "http://localhost:8000"

def test_civil_engineering_roadmap():
    """Test with Civil Engineering student profile"""
    
    print("="*60)
    print("🏗️ Testing Civil Engineering Roadmap Generation")
    print("="*60)
    
    payload = {
        "user_profile": {
            "age": "21",
            "gender": "Male",
            "nativeLanguage": "Sinhala",
            "preferredLanguage": "English",
            "olResults": "Maths: A, English: B, Science: A",
            "alStream": "Physical Science",
            "alResults": "Combined Maths: B, Physics: A, Chemistry: B",
            "ieltsScore": 6.5,
            "interestArea": "Engineering/Technology",
            "careerGoal": "Civil Engineering",  # Key: Civil Engineering
            "monthlyIncome": "50000 LKR",
            "fundingMethod": "Self-funded",
            "availability": "Weekday",
            "completionPeriod": "3-4 years",
            "studyMethod": "Onsite",
            "currentLocation": "Colombo, Sri Lanka",
            "preferredLocations": "Colombo, Sri Lanka"
        },
        "selected_course": {
            "course_name": "Bachelor of the Science of Engineering Honours in Civil Engineering",
            "university": "KDU",
            "location": "Ratmalana, Colombo",
            "match_score": 90.0,
            "explanation": "This Civil Engineering program is ideal for students interested in infrastructure development and construction.",
            "url": "https://kdu.ac.lk/civil-engineering",
            "career_opportunities": "Civil Engineer, Structural Engineer, Construction Manager, Project Engineer, Site Engineer",
            "study_language": "English",
            "study_method": "Full Time",
            "duration": "4 Years",
            "requirements": "A/L Physical Science with good grades in Mathematics and Physics",
            "course_fee": "Rs.750,000.00 per year",
            "department": "Faculty of Engineering"
        }
    }
    
    print("\n📤 Request payload:")
    print(json.dumps(payload, indent=2))
    
    print("\n🔄 Calling API...")
    response = requests.post(
        f"{API_BASE}/roadmap/generate",
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    print(f"\n📥 Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Roadmap Generated Successfully!")
        print(f"Status: {data['status']}")
        print(f"Stages: {len(data['roadmap'])}")
        
        print("\n📊 Metadata:")
        metadata = data['metadata']
        for key, value in metadata.items():
            print(f"  {key}: {value}")
        
        print("\n⚠️ Warnings:")
        for warning in data.get('warnings', []):
            print(f"  - {warning}")
        
        print("\n📖 First Stage (Foundation):")
        stage1 = data['roadmap'][0]
        print(f"  Title: {stage1['title']}")
        print(f"  Goal: {stage1['goal']}")
        print(f"  Duration: {stage1['duration']}")
        print(f"  Description: {stage1['description'][:100]}...")
        
        print("\n📋 Action Plan (Stage 1):")
        for i, action in enumerate(stage1['actionPlan'][:3], 1):
            print(f"  {i}. {action}")
        
        print("\n📚 Resources (Stage 1):")
        for resource in stage1['resources']:
            print(f"  - {resource['title']}")
        
        # Check if it's actually Civil Engineering focused
        print("\n🔍 Validation:")
        civil_keywords = ['civil', 'structural', 'construction', 'autocad', 'surveying', 'building', 'concrete']
        software_keywords = ['python', 'programming', 'software', 'coding', 'algorithm', 'git']
        
        full_text = json.dumps(data).lower()
        civil_count = sum(1 for keyword in civil_keywords if keyword in full_text)
        software_count = sum(1 for keyword in software_keywords if keyword in full_text)
        
        print(f"  Civil Engineering keywords found: {civil_count}")
        print(f"  Software Engineering keywords found: {software_count}")
        
        if civil_count > software_count:
            print("  ✅ PASS: Roadmap is Civil Engineering focused!")
        else:
            print("  ❌ FAIL: Roadmap appears to be Software focused!")
        
        # Save to file
        with open('civil_engineering_roadmap.json', 'w') as f:
            json.dump(data, f, indent=2)
        print("\n💾 Full response saved to civil_engineering_roadmap.json")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_civil_engineering_roadmap()
