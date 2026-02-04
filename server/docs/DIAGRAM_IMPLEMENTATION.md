# Diagram Generation API - Implementation Summary

## ✅ What Was Created

Following the **POST /api/profiles** pattern, a complete diagram generation API has been implemented with the following components:

---

## 📁 Files Created/Modified

### 1. **Model** - `server/models/Roadmap.js`
- MongoDB schema for storing generated roadmaps
- Includes user, profile, and course references
- Supports 6-stage roadmap structure with resources and success criteria
- Soft delete functionality with `isDeleted` flag
- Indexed for efficient queries

**Key Fields:**
- `userId`, `profileId`, `courseId` (references)
- `roadmap` array (6 stages with actions, resources, criteria)
- `metadata` (AI-generated insights)
- `warnings`, `errors` arrays
- `status`: success/error

---

### 2. **Service** - `server/services/diagramService.js`
Business logic layer following `alProfileService.js` pattern.

**Key Methods:**
- `generateRoadmap(userId, profileId, courseId, courseDetails)`
  - Fetches user profile from MongoDB
  - Checks for existing roadmap (caching)
  - Calls Python `/roadmap/generate` API
  - Maps colors to roadmap steps
  - Saves to database

- `getRoadmapById(roadmapId, userId)` - Fetch single roadmap
- `getAllRoadmaps(userId)` - List all user roadmaps
- `getRoadmapByProfileAndCourse(userId, profileId, courseId)` - Check if exists
- `deleteRoadmap(roadmapId, userId)` - Soft delete
- `callRoadmapAPI(userProfile, selectedCourse)` - Python API integration
- `mapRoadmapSteps(roadmapSteps)` - Add Tailwind colors

**Integration:**
- Axios HTTP client for Python backend
- 30-second timeout
- Error handling with descriptive messages
- Automatic color assignment (blue, purple, green, orange, red, indigo)

---

### 3. **Controller** - `server/controllers/diagramController.js`
HTTP request/response handler following `alProfileController.js` pattern.

**Endpoints:**
1. `generateRoadmap` - POST /api/diagram/generate
2. `getRoadmapById` - GET /api/diagram/:id
3. `getAllRoadmaps` - GET /api/diagram
4. `getRoadmapByProfileAndCourse` - GET /api/diagram/profile/:profileId/course/:courseId
5. `deleteRoadmap` - DELETE /api/diagram/:id

**Response Handling:**
- Uses utility functions: `created()`, `ok()`, `notFound()`, `forbidden()`, `badRequest()`
- Proper HTTP status codes (201, 200, 404, 403, 400)
- User authorization checks

---

### 4. **Validation** - `server/validations/diagramValidation.js`
Express-validator rules for input validation.

**Validators:**
- `generateRoadmapValidation`:
  - profileId (required, MongoDB ObjectId)
  - courseId (required, string)
  - courseDetails (required, object with university, duration, course_name)
  
- `roadmapIdValidation` - MongoDB ObjectId format
- `profileCourseValidation` - Both profileId and courseId

---

### 5. **Routes** - `server/routes/diagramRoutes.js`
RESTful API routes with authentication and validation middleware.

```
POST   /api/diagram/generate                              → Generate roadmap
GET    /api/diagram/:id                                   → Get by ID
GET    /api/diagram                                       → Get all user roadmaps
GET    /api/diagram/profile/:profileId/course/:courseId  → Check if exists
DELETE /api/diagram/:id                                   → Soft delete
```

**Middleware Chain:**
- `authenticate` - JWT verification
- `[validation]` - Express-validator rules
- `validateRequest` - Error aggregation
- `controller.method` - Handler function

---

### 6. **Documentation** - `server/docs/DIAGRAM_API.md`
Comprehensive API documentation including:
- All endpoints with examples
- Request/response schemas
- Authentication requirements
- Error responses
- Frontend integration code
- Testing with cURL

---

## 🔄 Data Flow

```
Frontend (Course Selection)
    ↓ POST /api/diagram/generate { profileId, courseId, courseDetails }
Node.js Server (Express)
    ↓ Authenticate user
    ↓ Validate request
    ↓ diagramController.generateRoadmap
    ↓
diagramService.generateRoadmap
    ↓ Fetch ALProfile from MongoDB
    ↓ Check existing roadmap (return if found)
    ↓ Prepare user profile data
    ↓
Python Backend (FastAPI)
    ↓ POST http://localhost:8000/roadmap/generate
    ↓ Run 4 AI agents (Curriculum, Career, Gap, Planning)
    ↓ Generate 6-stage roadmap
    ↓ Return JSON response
    ↓
diagramService (continued)
    ↓ Map roadmap steps (add colors)
    ↓ Save to MongoDB (Roadmap model)
    ↓ Return roadmap object
    ↓
diagramController
    ↓ Send 201 Created response
    ↓
Frontend
    ↓ Navigate to /diagram/:id page
    ↓ Display interactive roadmap
```

---

## 🎨 Frontend Integration

### Sample Usage
```typescript
// 1. When user selects a course
const handleCourseSelect = async (course) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.post(
      'http://localhost:3000/api/diagram/generate',
      {
        profileId: userProfile._id,
        courseId: course.id,
        courseDetails: {
          course_name: course.courseName,
          university: course.university,
          duration: course.duration,
          study_method: course.studyMethod,
          match_score: course.matchScore,
          explanation: course.explanation,
          career_opportunities: course.careerOpportunities
        }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    const roadmap = response.data.data.roadmap;
    router.push(`/diagram/${roadmap._id}`);
  } catch (error) {
    console.error('Error generating roadmap:', error);
  }
};

// 2. Display roadmap on diagram page
const DiagramPage = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  
  useEffect(() => {
    const fetchRoadmap = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/api/diagram/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoadmap(response.data.data.roadmap);
    };
    
    fetchRoadmap();
  }, [id]);
  
  return (
    <div>
      {roadmap?.roadmap.map((step) => (
        <RoadmapCard
          key={step.id}
          title={step.title}
          goal={step.goal}
          duration={step.duration}
          actionPlan={step.actionPlan}
          resources={step.resources}
          successCriteria={step.successCriteria}
          color={step.color}
        />
      ))}
    </div>
  );
};
```

---

## 🗄️ Database Schema

### Roadmap Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  userId: ObjectId("507f1f77bcf86cd799439012"),
  profileId: ObjectId("507f1f77bcf86cd799439013"),
  courseId: "NSBM_SE_001",
  courseName: "Bachelor of Software Engineering Honours",
  university: "NSBM Green University",
  careerGoal: "Software Engineer",
  status: "success",
  roadmap: [
    {
      id: 1,
      title: "Foundation Stage",
      goal: "Build Strong Programming Fundamentals",
      icon: "BookOpen",
      duration: "6-8 Weeks",
      description: "Start your journey...",
      actionPlan: [
        "Complete Introduction to Computer Science",
        "Practice basic syntax",
        "Build static website"
      ],
      resources: [
        { title: "MDN Web Docs", url: "https://..." }
      ],
      successCriteria: [
        "Understand variables, loops, functions",
        "Deploy Hello World project"
      ],
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600"
    }
    // ... 5 more stages
  ],
  metadata: {
    curriculum_focus: "Software Engineering Foundations",
    languages: ["Python", "Java"],
    skill_gaps_count: 8,
    priority_skills: ["DSA", "OOP", "Git"]
  },
  warnings: ["Your course has 8 skill gaps..."],
  isDeleted: false,
  createdAt: "2026-02-04T10:30:00.000Z",
  updatedAt: "2026-02-04T10:30:00.000Z"
}
```

---

## 🔐 Security Features

1. **Authentication Required**: All endpoints require JWT token
2. **User Isolation**: Can only access own roadmaps
3. **Profile Authorization**: Validates user owns the profile
4. **Input Validation**: Express-validator checks all inputs
5. **Soft Delete**: Data never permanently removed

---

## ⚡ Performance Features

1. **Caching**: Returns existing roadmap if found (no regeneration)
2. **Database Indexes**: Optimized queries on userId, profileId, courseId
3. **Timeout Protection**: 30-second limit on Python API calls
4. **Error Handling**: Graceful degradation with descriptive messages

---

## 🧪 Testing

### Test the API
```bash
# 1. Start Python backend
cd backend
python -m uvicorn api.main:app --reload

# 2. Start Node.js server
cd server
npm start

# 3. Test endpoint
curl -X POST http://localhost:3000/api/diagram/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "507f1f77bcf86cd799439011",
    "courseId": "NSBM_SE_001",
    "courseDetails": {
      "course_name": "Bachelor of Software Engineering Honours",
      "university": "NSBM Green University",
      "duration": "3-4 Years",
      "study_method": "Full Time"
    }
  }'
```

---

## 📝 Environment Setup

Add to `.env`:
```env
PYTHON_API_URL=http://localhost:8000
```

---

## ✨ Features Implemented

✅ RESTful API design following best practices  
✅ JWT authentication and authorization  
✅ Input validation with express-validator  
✅ MongoDB integration with Mongoose  
✅ Python backend integration (FastAPI)  
✅ Error handling and proper HTTP status codes  
✅ Soft delete functionality  
✅ Caching mechanism (no duplicate generation)  
✅ Frontend-ready response structure  
✅ Tailwind CSS color mapping  
✅ Comprehensive API documentation  

---

## 🚀 Next Steps

1. **Frontend Integration**:
   - Update course selection modal to call `/api/diagram/generate`
   - Create `/diagram/:id` page to display roadmap
   - Add loading states and error handling

2. **Testing**:
   - Write unit tests for service methods
   - Add integration tests for API endpoints
   - Test error scenarios

3. **Enhancements**:
   - Add roadmap update functionality
   - Implement progress tracking (mark stages complete)
   - Add sharing functionality
   - Export roadmap as PDF

4. **Monitoring**:
   - Add logging for Python API calls
   - Track generation times
   - Monitor error rates

---

## 📚 Related Documentation

- [Python Roadmap API](../../backend/docs/ROADMAP_API.md)
- [AL Profile API](../README.md)
- [Authentication](../docs/AUTH.md)
