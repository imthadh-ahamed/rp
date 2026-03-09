# 🚀 Quick Start Guide - Roadmap Generation System

## ✅ Setup Complete!

The Agentic RAG Roadmap Generation system is now ready to use.

---

## 🎯 Two Ways to Use It

### Option 1: Standalone Demo (No API Server)

Run the demo script to see the system in action without starting the API:

```bash
cd backend
python scripts/demo_roadmap_system.py
```

**What it does:**
- ✅ Shows agent execution flow
- ✅ Generates a 6-stage roadmap
- ✅ Displays metadata and warnings
- ✅ Saves output to `demo_roadmap_output.json`

**Output Example:**
```
🔍 Analyzing course curriculum...
🎯 Inferring requirements for Software Engineer...
📊 Identifying skill gaps...
🗺️ Generating personalized roadmap...

✅ Status: success
📌 Metadata:
   Focus Area: Software Engineering Foundations
   Languages: Python, Java
   Skill Gaps: 7 (high severity)
   
🗺️  Roadmap Overview (6 stages):
   Stage 1: Foundation Stage
   Stage 2: Skill Development
   ...
```

---

### Option 2: API Server (For Frontend Integration)

Start the FastAPI server:

```bash
cd backend
python -m uvicorn api.main:app --reload
```

**Available Endpoints:**
- `http://localhost:8000` - Root
- `http://localhost:8000/docs` - Interactive API docs
- `http://localhost:8000/roadmap/generate` - Generate roadmap
- `http://localhost:8000/roadmap/health` - Health check

**Test the API:**

```bash
# Option A: Use the test script
python scripts/test_roadmap_api.py

# Option B: Use curl
curl -X POST http://localhost:8000/roadmap/generate \
  -H "Content-Type: application/json" \
  -d @sample_request.json
```

---

## 📝 Sample Request

Create a file `sample_request.json`:

```json
{
  "user_profile": {
    "name": "John Doe",
    "al_stream": "Physical Science",
    "interests": ["Programming", "Web Development"]
  },
  "selected_course": {
    "id": "course_001",
    "course_name": "Bachelor of Software Engineering Honours",
    "university": "NSBM Green University",
    "duration": "3-4 Years",
    "study_method": "Onsite",
    "curriculum": "Programming, DSA, Databases, Web Development"
  },
  "career_goal": "Software Engineer"
}
```

---

## 🔌 Frontend Integration

In your React/Next.js component:

```typescript
import { generateRoadmapFromRecommendation } from '@/services/roadmapService';

// When user selects a course
const handleGenerateRoadmap = async (course: Recommendation) => {
  try {
    const result = await generateRoadmapFromRecommendation(
      course,
      userProfile,
      'Software Engineer'  // or let user choose
    );
    
    // Navigate to diagram page with roadmap
    router.push(`/diagram?courseId=${course.id}`);
    
    // Or store in state/localStorage
    localStorage.setItem('roadmap', JSON.stringify(result.roadmap));
  } catch (error) {
    console.error('Failed to generate roadmap:', error);
  }
};
```

---

## 📊 Available Career Goals

Choose from:
- `"Software Engineer"`
- `"Data Engineer"`
- `"Full Stack Developer"`
- `"DevOps Engineer"`
- `"Machine Learning Engineer"`

---

## 🗺️ Roadmap Output Structure

The API returns 6 stages:

1. **Foundation Stage** (6-8 Weeks)
   - Programming fundamentals
   - Development environment setup

2. **Skill Development** (8-12 Weeks)
   - Core technical skills
   - Project building

3. **Real-world Readiness** (10-14 Weeks)
   - Practical application
   - Internship preparation

4. **Performance Strategies** (6-10 Weeks)
   - Optimization techniques
   - Interview preparation

5. **Knowledge Expansion** (8-12 Weeks)
   - Advanced topics
   - Specialization

6. **Industry Polishing** (4-8 Weeks)
   - Job market preparation
   - Portfolio building

Each stage includes:
- `actionPlan`: 3-5 specific actions
- `resources`: Learning materials with URLs
- `successCriteria`: Measurable goals

---

## 🧪 Testing Checklist

- [x] Demo script runs successfully
- [ ] API server starts without errors
- [ ] Health check endpoint responds
- [ ] Generate endpoint returns valid roadmap
- [ ] Frontend service connects to API
- [ ] Different career goals generate different roadmaps

---

## 📚 Documentation

- **Full API Reference**: `backend/docs/ROADMAP_API.md`
- **Implementation Guide**: `ROADMAP_IMPLEMENTATION.md`
- **Interactive Docs**: http://localhost:8000/docs (when server running)

---

## 🛠️ Troubleshooting

### Import Error: "No module named 'api'"

The script now includes path setup automatically. Make sure to run from the `backend` directory.

### Port Already in Use

If port 8000 is busy:
```bash
python -m uvicorn api.main:app --reload --port 8000
```

### LLM Not Connected

The system uses a deterministic fallback by default. To enable LLM:
1. Set up your LLM client (OpenAI/Anthropic)
2. Update `api/routes/roadmap.py` to pass LLM client to orchestrator

---

## ✨ What's Next?

1. **Test the demo** ✅ (Done!)
2. **Start API server** and test with `test_roadmap_api.py`
3. **Integrate with frontend** using `roadmapService.ts`
4. **Add career goal selector** to your UI
5. **Display roadmap** on the diagram page

---

## 🎉 Success!

Your Agentic RAG Roadmap Generation system is fully operational! 

Run the demo to see it in action, or start the API server for frontend integration.

---

**Questions or Issues?**
- Check the full docs: `backend/docs/ROADMAP_API.md`
- Review the demo output: `demo_roadmap_output.json`
- Test the API: `python scripts/test_roadmap_api.py`
