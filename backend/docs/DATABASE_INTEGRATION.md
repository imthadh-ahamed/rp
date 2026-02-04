# 🔌 Database Integration Guide

## Your Data Structure is Ready!

The roadmap system now works with your **exact database structure** from the recommendation system.

---

## ✅ What Was Updated

### 1. **SelectedCourse Schema** - Now accepts all your DB fields:

```python
{
  # Required fields
  "course_name": "Bachelor of Software Engineering Honours",
  "university": "Open University of Sri Lanka", 
  "duration": "4 Years",
  "study_method": "Full Time",
  
  # Optional fields (all from your DB)
  "id": "course_001",
  "location": "Colombo",
  "department": "Faculty of Engineering Technology",
  "match_score": 82.19,
  "explanation": "This course is well-suited...",
  "url": "https://ou.ac.lk/...",
  "career_opportunities": "Software Engineer, System Analyst...",
  "study_language": "English",
  "requirements": "Applicants should meet...",
  "course_fee": "Rs.660,000.00",
  "curriculum": "Programming, DSA, Web Development..."
}
```

### 2. **CurriculumAgent** - Uses all available data:
- Analyzes `course_name`, `curriculum`, `explanation`
- Extracts skills from `career_opportunities`
- Uses `requirements` for context
- More accurate skill detection

### 3. **Frontend Service** - Maps your recommendation object:
- Handles both camelCase and snake_case
- Extracts all available fields
- Flexible field mapping

---

## 📡 How to Use from Your Backend

### Python/FastAPI (Backend to Backend)

```python
import requests

# Get course from your database
course = db.query(Course).filter(Course.id == course_id).first()

# Get user profile
user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

# Call roadmap API
response = requests.post('http://localhost:8000/roadmap/generate', json={
    "user_profile": {
        "age": user_profile.age,
        "gender": user_profile.gender,
        "alStream": user_profile.al_stream,
        "interestArea": user_profile.interest_area,
        "careerGoal": user_profile.career_goal,
        "studyMethod": user_profile.study_method,
        "availability": user_profile.availability,
        "currentLocation": user_profile.location,
        # ... all your profile fields
    },
    "selected_course": {
        "course_name": course.course_name,
        "university": course.university,
        "duration": course.duration,
        "study_method": course.study_method,
        "location": course.location,
        "department": course.department,
        "match_score": course.match_score,
        "explanation": course.explanation,
        "url": course.url,
        "career_opportunities": course.career_opportunities,
        "study_language": course.study_language,
        "requirements": course.requirements,
        "course_fee": course.course_fee,
        "curriculum": course.curriculum,
        # ... all your course fields
    },
    "career_goal": "Software Engineer"
})

roadmap = response.json()
```

---

## 🎯 Node.js/Express Integration

### From your server/routes (if you want to proxy)

```javascript
// server/routes/roadmapRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/generate-roadmap', async (req, res) => {
  try {
    const { courseId, userId, careerGoal } = req.body;
    
    // Fetch course from your DB
    const course = await db.query(
      'SELECT * FROM courses WHERE id = ?', 
      [courseId]
    );
    
    // Fetch user profile
    const profile = await db.query(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );
    
    // Call Python roadmap API
    const roadmapResponse = await axios.post(
      'http://localhost:8000/roadmap/generate',
      {
        user_profile: profile[0],
        selected_course: course[0],
        career_goal: careerGoal
      }
    );
    
    res.json(roadmapResponse.data);
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## 🔌 Frontend Integration (React/Next.js)

### Already configured in `roadmapService.ts`:

```typescript
import { generateRoadmapFromRecommendation } from '@/services/roadmapService';

// When user selects a course from recommendations
const handleSelectCourse = async (course: Recommendation) => {
  try {
    // Get user profile from your state/context
    const userProfile = getUserProfile(); // Your function
    
    // Generate roadmap - automatically maps all fields!
    const result = await generateRoadmapFromRecommendation(
      course,           // Your full recommendation object from DB
      userProfile,      // Your full user profile
      'Software Engineer'
    );
    
    // Use the roadmap
    console.log('Generated stages:', result.roadmap.length);
    console.log('Skill gaps:', result.metadata.skill_gaps_count);
    
    // Save to localStorage or state
    localStorage.setItem('currentRoadmap', JSON.stringify(result));
    
    // Navigate to diagram page
    router.push(`/diagram?courseId=${course.id}`);
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

---

## 📊 Field Mapping Reference

The service automatically handles these field variations:

| Your DB Field | Alternative | Maps To |
|---------------|-------------|---------|
| `course_name` | `courseName` | ✅ |
| `study_method` | `studyMethod` | ✅ |
| `match_score` | `matchScore` | ✅ |
| `career_opportunities` | `careerOpportunities` | ✅ |
| `study_language` | `studyLanguage` | ✅ |
| `course_fee` | `courseFee` | ✅ |
| `id` | `_id` | ✅ |

**All fields are optional** - the system works with whatever you provide!

---

## 🧪 Testing with Your Data

### Test with actual DB data:

```python
# backend/scripts/test_with_db_data.py
import requests
import json

# Simulate fetching from your DB
db_course = {
    "course_name": "Bachelor of Software Engineering Honours",
    "university": "Open University of Sri Lanka",
    "location": "Colombo",
    "match_score": 82.19574332237244,
    "explanation": "This course is well-suited for IT students...",
    "url": "https://ou.ac.lk/programme/...",
    "career_opportunities": "Software Engineer, System Analyst, Architect...",
    "study_language": "English",
    "study_method": "Full Time",
    "duration": "4 Years",
    "requirements": "Applicants should meet general requirements...",
    "course_fee": "Rs.660,000.00",
    "department": "Faculty of Engineering Technology"
}

db_profile = {
    "age": "20",
    "gender": "Male",
    "nativeLanguage": "Tamil",
    "alStream": "Physical Science",
    "interestArea": "Information Technology",
    "careerGoal": "Software Engineer or Data Engineer",
    "studyMethod": "Onsite",
    "currentLocation": "Colombo, Sri Lanka"
}

# Call API
response = requests.post('http://localhost:8000/roadmap/generate', json={
    "user_profile": db_profile,
    "selected_course": db_course,
    "career_goal": "Software Engineer"
})

print(json.dumps(response.json(), indent=2))
```

---

## ✨ Benefits of Current Integration

1. **✅ No data transformation needed** - Pass DB objects directly
2. **✅ All fields optional** - Missing fields won't break anything
3. **✅ Rich analysis** - Uses explanation, career_opportunities, requirements
4. **✅ Flexible** - Works with any additional DB fields
5. **✅ Type safe** - Frontend has full TypeScript types

---

## 🎯 Example Workflow

```
1. User browses recommendations
   ↓
2. User clicks "Select Course" 
   ↓
3. Frontend calls: generateRoadmapFromRecommendation(course, profile, goal)
   ↓
4. Service maps DB fields automatically
   ↓
5. Agents analyze all available data
   ↓
6. 6-stage personalized roadmap generated
   ↓
7. Display on diagram page
```

---

## 🔍 What the Agents Extract

From your data, the system automatically extracts:

### From `course_name`:
- Academic level (Bachelor, Master)
- Focus area (Software Engineering, Data Science)

### From `career_opportunities`:
- Potential career paths
- Industry-relevant skills

### From `explanation`:
- Course suitability factors
- Key highlights

### From `requirements`:
- Entry level expectations
- Prior knowledge needed

### From `curriculum` (if available):
- Specific technologies
- Programming languages
- Core competencies

**Result**: More accurate skill gap analysis and better roadmaps!

---

## 🚀 Ready to Deploy

Your database structure is **fully compatible**. No changes needed to your:
- ✅ Course table
- ✅ User profile table  
- ✅ Recommendation logic
- ✅ Existing APIs

Just call the roadmap API when user selects a course!

---

## 📞 Need Help?

- **Test with demo**: `python scripts/demo_roadmap_system.py`
- **API docs**: http://localhost:8000/docs
- **Full guide**: `backend/docs/ROADMAP_API.md`
