"""Test Gemini with actual explanation prompt"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm.deepseek_client import chat

# Sample user and course data
user = {
    'interest_area': 'Software Engineering',
    'career_goal': 'Software Engineer, Data Scientist',
    'study_method': 'Full Time',
    'preferred_locations': 'Colombo',
    'al_stream': 'Physical Science',
    'al_results': 'Combined Maths: B, Chemistry: C, Physics: C',
    'other_qualifications': ''
}

meta = {
    'Course': 'BSc (Hons) Software Engineering Degree',
    'Location': 'Saeigs',
    'Study Method': 'Full Time',
    'Duration': '4 Years',
    'Career Opportunities': 'Software Developer, System Analyst, Data Scientist'
}

prompt = f"""
You are an academic counselor. Explain clearly why this course is a strong match
for the student. Write 3–4 short sentences. Cover:

• alignment with interest area
• support for career goal
• match with preferred study method & location
• suitability based on academic background

STUDENT:
- Interest Area: {user.get('interest_area')}
- Career Goal: {user.get('career_goal')}
- Study Method: {user.get('study_method')}
- Preferred Location: {user.get('preferred_locations')}
- A/L Stream: {user.get('al_stream')}
- A/L Results: {user.get('al_results')}
- Other Qualifications: {user.get('other_qualifications')}

COURSE:
- Title: {meta.get('Course')}
- Location: {meta.get('Location')}
- Method: {meta.get('Study Method')}
- Duration: {meta.get('Duration')}
- Career Opportunities: {meta.get('Career Opportunities')}
"""

system = "You are an academic counselor. Explain clearly and professionally in 3–4 short sentences."

print("="*80)
print("TESTING GEMINI WITH EXPLANATION PROMPT")
print("="*80)
print("\nPrompt length:", len(prompt), "characters")
print("\n" + "="*80)

response = chat(prompt, system, timeout=30)

print("\nRESPONSE:")
print("="*80)
print(response)
print("="*80)
