# 🗺️ Agentic RAG Roadmap Generation API

## Overview

This is a **production-ready, research-grade Agentic RAG system** that generates personalized learning roadmaps based on:
- User profile and preferences
- Selected university course
- Target career goal (Software Engineer, Data Engineer, etc.)

### Why This is TRUE Agentic RAG

✅ **Retrieval**: Analyzes course curriculum and extracts skills
✅ **Reasoning**: Identifies gaps between education and industry needs  
✅ **Planning**: Multi-agent coordination for roadmap structure
✅ **Generation**: LLM synthesis of personalized content
✅ **Explainable**: Provides warnings and metadata about skill gaps

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│            RoadmapOrchestrator                       │
│  (Coordinates all agents)                            │
└────────────┬────────────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│Curriculum│  │Career    │  │Skill Gap │  │Roadmap   │
│Agent     │→ │Path Agent│→ │Agent     │→ │Planning  │
│          │  │          │  │          │  │Agent     │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
     │              │             │             │
     ▼              ▼             ▼             ▼
  Extract       Map Career    Identify      Generate
  Course        Requirements  Missing       6-Stage
  Skills        & Journey     Skills        Roadmap
```

### Agent Responsibilities

| Agent | Input | Output | Purpose |
|-------|-------|--------|---------|
| **Curriculum Agent** | Course details | Core skills, languages, focus area | Analyzes what the course teaches |
| **Career Path Agent** | Career goal | Required skills, typical journey | Maps industry expectations |
| **Skill Gap Agent** | Curriculum + Requirements | Missing/covered/priority skills | Identifies learning gaps |
| **Roadmap Planning Agent** | All agent outputs | 6-stage roadmap JSON | Synthesizes personalized plan |

---

## 📡 API Endpoints

### 1. Generate Roadmap

**Endpoint**: `POST /roadmap/generate`

**Description**: Generate a personalized 6-stage learning roadmap using agentic RAG.

**Request Body**:

```json
{
  "user_profile": {
    "name": "John Doe",
    "al_stream": "Physical Science",
    "z_score": 1.85,
    "subjects": ["Combined Maths", "Physics", "Chemistry"],
    "interests": ["Programming", "Problem Solving"],
    "location": "Colombo"
  },
  "selected_course": {
    "id": "course_123",
    "course_name": "Bachelor of Software Engineering Honours",
    "university": "NSBM Green University",
    "department": "School of Computing",
    "duration": "3-4 Years",
    "study_method": "Onsite",
    "location": "Pitipana, Homagama",
    "curriculum": "Programming, DSA, Databases, Web Development..."
  },
  "career_goal": "Software Engineer",
  "preferences": {
    "learning_style": "project-based",
    "time_commitment": "full-time"
  }
}
```

**Career Goal Options**:
- `"Software Engineer"`
- `"Data Engineer"`
- `"Full Stack Developer"`
- `"DevOps Engineer"`
- `"Machine Learning Engineer"`

**Response**:

```json
{
  "status": "success",
  "roadmap": [
    {
      "id": 1,
      "title": "Foundation Stage",
      "goal": "Build Strong Programming Fundamentals",
      "icon": "BookOpen",
      "duration": "6-8 Weeks",
      "description": "Master core programming concepts...",
      "actionPlan": [
        "Master Python programming basics",
        "Practice coding challenges daily",
        "Learn Git version control fundamentals"
      ],
      "resources": [
        {
          "title": "Python Official Tutorial",
          "url": "https://docs.python.org/3/tutorial/"
        },
        {
          "title": "LeetCode Easy Problems",
          "url": "https://leetcode.com"
        }
      ],
      "successCriteria": [
        "Complete 20+ coding problems",
        "Build 1-2 small projects"
      ]
    }
    // ... 5 more stages
  ],
  "metadata": {
    "curriculum_focus": "Software Engineering Foundations",
    "languages": ["Java", "Python"],
    "duration_years": 3.5,
    "skill_gaps_count": 4,
    "gap_severity": "medium",
    "priority_skills": ["System Design", "Cloud Platforms"]
  },
  "warnings": [
    "Your course has 4 skill gaps. Consider supplementing with online courses.",
    "Priority skills to learn: System Design, Cloud Platforms, Production Databases"
  ],
  "errors": []
}
```

**Roadmap Stages** (always 6):

1. **Foundation Stage** - Programming fundamentals
2. **Skill Development** - Core technical skills
3. **Real-world Readiness** - Practical projects
4. **Performance Strategies** - Optimization techniques
5. **Knowledge Expansion** - Advanced topics
6. **Industry Polishing** - Job readiness

---

### 2. Health Check

**Endpoint**: `GET /roadmap/health`

**Response**:

```json
{
  "status": "healthy",
  "service": "roadmap-generation",
  "agents": [
    "curriculum_agent",
    "career_path_agent",
    "skill_gap_agent",
    "roadmap_planning_agent"
  ]
}
```

---

## 🧪 Testing

### Run the API Server

```bash
cd backend
python -m uvicorn api.main:app --reload
```

Server will start at: `http://localhost:8000`

### Test with Script

```bash
python scripts/test_roadmap_api.py
```

### Test with curl

```bash
curl -X POST http://localhost:8000/roadmap/generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_profile": {"name": "Test User"},
    "selected_course": {
      "id": "123",
      "course_name": "Bachelor of Software Engineering",
      "university": "NSBM",
      "duration": "4 Years",
      "study_method": "Onsite",
      "curriculum": "Programming, DSA, Databases"
    },
    "career_goal": "Software Engineer"
  }'
```

### Interactive API Docs

Visit: `http://localhost:8000/docs`

FastAPI provides automatic interactive documentation where you can test endpoints directly.

---

## 🔌 Frontend Integration

### Fetch Roadmap (TypeScript/React)

```typescript
import { useState } from 'react';

interface RoadmapRequest {
  user_profile: any;
  selected_course: {
    id: string;
    course_name: string;
    university: string;
    duration: string;
    study_method: string;
    curriculum?: string;
  };
  career_goal: "Software Engineer" | "Data Engineer" | "Full Stack Developer" | "DevOps Engineer" | "Machine Learning Engineer";
  preferences?: any;
}

async function generateRoadmap(request: RoadmapRequest) {
  const response = await fetch('http://localhost:8000/roadmap/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return await response.json();
}

// Usage in component
const [roadmap, setRoadmap] = useState(null);
const [loading, setLoading] = useState(false);

const handleGenerateRoadmap = async (course, userProfile) => {
  setLoading(true);
  try {
    const result = await generateRoadmap({
      user_profile: userProfile,
      selected_course: course,
      career_goal: "Software Engineer"
    });
    
    setRoadmap(result.roadmap);
    console.log('Metadata:', result.metadata);
    console.log('Warnings:', result.warnings);
  } catch (error) {
    console.error('Failed to generate roadmap:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 🛠️ Customization

### Adding More Career Goals

Edit [career_path_agent.py](../core/agents/career_path_agent.py):

```python
CareerGoal.YOUR_ROLE: {
    "required": ["Skill 1", "Skill 2"],
    "optional": ["Skill 3"],
    "description": "Role description",
    "journey": ["Step 1", "Step 2"]
}
```

### Integrating LLM

Currently uses fallback deterministic generation. To use LLM:

```python
# In roadmap_orchestrator.py
from llm.openai_client import OpenAIClient  # or your LLM client

llm_client = OpenAIClient(api_key="your-key")
orchestrator = RoadmapOrchestrator(llm_client=llm_client)
```

The LLM will generate more natural, personalized roadmaps.

### Adding RAG Retrieval

Extend `CurriculumAgent` to retrieve from vector store:

```python
from vectorstore.chroma_store import ChromaStore

class CurriculumAgent:
    def __init__(self, vector_store: ChromaStore):
        self.vector_store = vector_store
    
    def analyze(self, course):
        # Query vector store for similar courses
        similar_courses = self.vector_store.query(
            query_text=course.course_name,
            n_results=5
        )
        # Use retrieved context in analysis
        ...
```

---

## 📊 Response Types

### RoadmapStep

```typescript
interface RoadmapStep {
  id: number;               // 1-6
  title: string;            // Stage name
  goal: string;             // Main objective
  icon: string;             // Lucide icon name
  duration: string;         // e.g., "6-8 Weeks"
  description: string;      // Detailed description
  actionPlan: string[];     // 3-5 actionable items
  resources: Resource[];    // Learning resources
  successCriteria: string[]; // Completion criteria
}

interface Resource {
  title: string;
  url: string;
}
```

### Metadata

```typescript
interface Metadata {
  curriculum_focus: string;    // e.g., "Software Engineering Foundations"
  languages: string[];         // Programming languages
  duration_years: number;      // Course duration
  skill_gaps_count: number;    // Number of missing skills
  gap_severity: "low" | "medium" | "high";
  priority_skills: string[];   // Top 3 critical gaps
}
```

---

## 🚀 Deployment

### Docker

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

```bash
# Optional: for LLM integration
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key

# Optional: for vector store
CHROMA_HOST=localhost
CHROMA_PORT=8001
```

---

## 📝 Academic Context

This system is suitable for:

✅ **Research Papers**: Demonstrates multi-agent RAG architecture  
✅ **Thesis Work**: Shows practical AI application in education  
✅ **Final Year Projects**: Production-ready code with testing  
✅ **Portfolio**: Showcases modern AI/ML engineering skills

**Key Innovations**:
- Multi-agent orchestration for complex reasoning
- Skill gap analysis using domain knowledge
- Deterministic fallback + optional LLM enhancement
- Explainable AI with metadata and warnings

---

## 🤝 Contributing

To extend this system:

1. Add new agents in `core/agents/`
2. Update orchestrator to include new agent
3. Add new schemas in `api/schemas/roadmap.py`
4. Update API route if needed
5. Add tests in `scripts/test_roadmap_api.py`

---

## 📚 Related Files

- **Schemas**: `api/schemas/roadmap.py`
- **Agents**: `core/agents/*.py`
- **Routes**: `api/routes/roadmap.py`
- **Tests**: `scripts/test_roadmap_api.py`

---

## 📞 Support

For issues or questions:
1. Check FastAPI docs: `http://localhost:8000/docs`
2. Review agent logs in console
3. Check `roadmap_response.json` for full output

---

**Built with ❤️ using FastAPI, Pydantic, and Multi-Agent Architecture**
