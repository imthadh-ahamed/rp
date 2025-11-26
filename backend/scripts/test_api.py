import requests
import json

url = "http://localhost:8000/recommend"

payload = {
    "age": "20",
    "native_language": "Sinhala",
    "preferred_language": "English",
    "ol_results": "8A 1B",
    "al_stream": "Physical Science",
    "al_results": "3B",
    "ielts": "6.5",
    "interest_area": "Software Engineering",
    "career_goal": "Software Engineer",
    "income": "50000",
    "study_method": "Full Time",
    "availability": "Weekdays",
    "completion_period": "4 Years",
    "current_location": "Colombo",
    "preferred_locations": "Colombo"
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ API Response Success!")
        print(f"Status: {data.get('status')}")

except Exception as e:
    print(f"❌ Connection Error: {e}")
