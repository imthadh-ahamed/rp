import requests
import json

url = "http://localhost:8000/recommend"

payload = {
    "age": "20",
    "native_language": "Tamil",
    "preferred_language": "English",
    "ol_results": "Maths: A, Science: B, English: A, ICT: B",
    "al_stream": "Physical Science",
    "al_results": "Combined Maths: B, Chemistry: C, Physics: C",
    "other_qualifications": "None",
    "ielts": "6.0",
    "interest_area": "Information Technology",
    "career_goal": "Software Engineer, Data Scientist",
    "income": "45000 LKR",
    "study_method": "Onsite",
    "availability": "Weekdays",
    "completion_period": "3-4 years",
    "current_location": "Colombo",
    "preferred_locations": "Colombo",
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ API Response Success!")
        print(f"Status: {data.get('status')}")
        
        if data.get('recommendations'):
            top_rec = data['recommendations'][0]
            print(f"\nTop Recommendation Details:")
            print(f"ID: {top_rec.get('id')}")
            print(f"Course: {top_rec.get('course_name')}")
            print(f"Fee: {top_rec.get('course_fee')}")
            print(f"Tags: {top_rec.get('tags')}")
            print(f"Requirements: {top_rec.get('requirements')[:50]}...")
            
            # Save to file for verification
            with open("result.json", "w", encoding="utf-8") as f:
                json.dump(top_rec, f, indent=2)
    else:
        print(f"❌ API Error: {response.text}")

except Exception as e:
    print(f"❌ Connection Error: {e}")
