"""
Test career-domain filtering via API
This tests the complete recommendation flow with career intent
"""
import requests
import json

url = "http://localhost:8000/recommend"

# Test Case 1: Civil Engineer
print("=" * 80)
print("TEST CASE 1: Civil Engineer")
print("=" * 80)

payload_civil = {
    "age": "20",
    "native_language": "Sinhala",
    "preferred_language": "English",
    "ol_results": "Maths: A, English: B, Science: B, ICT: A",
    "al_stream": "Physical Science",
    "al_results": "Combined Maths: S, Physics: S, Chemistry: S",
    "other_qualifications": "None",
    "ielts": "",
    "interest_area": "Engineering/Technology",
    "career_goal": "Civil engineer",  # 🎯 Key field
    "income": "45000 LKR",
    "study_method": "Hybrid",
    "availability": "Weekday",
    "completion_period": "3-4 years",
    "current_location": "Colombo, Sri Lanka",
    "preferred_locations": "Colombo, Sri Lanka",
}

try:
    print(f"\n📤 Sending request for Civil Engineer...")
    response = requests.post(url, json=payload_civil, timeout=30)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Status: {data.get('status')}")
        
        recommendations = data.get('recommendations', [])
        print(f"\n📊 Top 5 Recommendations:")
        
        civil_count = 0
        non_civil_count = 0
        
        for i, rec in enumerate(recommendations[:5], 1):
            course = rec.get('course_name', 'Unknown')
            score = rec.get('match_score', 0)
            explanation = rec.get('explanation', '')[:100]
            
            # Check if civil-related
            is_civil = any(keyword in course.lower() for keyword in 
                          ['civil', 'construction', 'structural', 'building services'])
            
            if is_civil:
                civil_count += 1
                status = "✅ CIVIL"
            else:
                non_civil_count += 1
                status = "❌ NON-CIVIL"
            
            print(f"\n{i}. {status} [{score:.1f}%]")
            print(f"   Course: {course}")
            print(f"   Explanation: {explanation}...")
        
        print(f"\n📈 Results Summary:")
        print(f"   Civil-related courses: {civil_count}/5 ({civil_count*20}%)")
        print(f"   Non-civil courses: {non_civil_count}/5 ({non_civil_count*20}%)")
        
        if civil_count >= 4:
            print(f"   ✅ TEST PASSED: Career filtering working correctly!")
        else:
            print(f"   ⚠️ TEST WARNING: Expected more civil-related courses")
            
    else:
        print(f"❌ API Error: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"❌ Connection Error: {e}")

# Test Case 2: Software Engineer
print("\n\n" + "=" * 80)
print("TEST CASE 2: Software Engineer")
print("=" * 80)

payload_software = {
    "age": "20",
    "native_language": "Tamil",
    "preferred_language": "English",
    "ol_results": "Maths: A, Science: B, English: A, ICT: B",
    "al_stream": "Physical Science",
    "al_results": "Combined Maths: B, Chemistry: C, Physics: C",
    "other_qualifications": "None",
    "ielts": "6.0",
    "interest_area": "Information Technology",
    "career_goal": "Software Engineer",  # 🎯 Key field
    "income": "45000 LKR",
    "study_method": "Onsite",
    "availability": "Weekday",
    "completion_period": "3-4 years",
    "current_location": "Colombo",
    "preferred_locations": "Colombo",
}

try:
    print(f"\n📤 Sending request for Software Engineer...")
    response = requests.post(url, json=payload_software, timeout=30)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Status: {data.get('status')}")
        
        recommendations = data.get('recommendations', [])
        print(f"\n📊 Top 5 Recommendations:")
        
        software_count = 0
        non_software_count = 0
        
        for i, rec in enumerate(recommendations[:5], 1):
            course = rec.get('course_name', 'Unknown')
            score = rec.get('match_score', 0)
            
            # Check if software-related
            is_software = any(keyword in course.lower() for keyword in 
                            ['software', 'computer science', 'information technology', 'computing'])
            
            if is_software:
                software_count += 1
                status = "✅ SOFTWARE"
            else:
                non_software_count += 1
                status = "❌ NON-SOFTWARE"
            
            print(f"\n{i}. {status} [{score:.1f}%]")
            print(f"   Course: {course}")
        
        print(f"\n📈 Results Summary:")
        print(f"   Software-related courses: {software_count}/5 ({software_count*20}%)")
        print(f"   Non-software courses: {non_software_count}/5 ({non_software_count*20}%)")
        
        if software_count >= 4:
            print(f"   ✅ TEST PASSED: Career filtering working correctly!")
        else:
            print(f"   ⚠️ TEST WARNING: Expected more software-related courses")
            
    else:
        print(f"❌ API Error: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"❌ Connection Error: {e}")

print("\n" + "=" * 80)
print("Career Filtering Test Complete")
print("=" * 80)
