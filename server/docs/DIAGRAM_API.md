# Diagram (Roadmap) Generation API

## Overview
This API generates personalized learning roadmaps using AI-powered agentic RAG system. It integrates with the Python backend to analyze user profiles and course details, then generates a 6-stage learning roadmap.

## Base URL
```
http://localhost:3000/api/diagram
```

---

## Endpoints

### 1. Generate Roadmap
**POST** `/api/diagram/generate`

Generate a personalized learning roadmap for a user based on their profile and selected course.

#### Authentication
- **Required**: Yes
- **Type**: Bearer Token (JWT)

#### Request Body
```json
{
  "profileId": "507f1f77bcf86cd799439011",
  "courseId": "NSBM_SE_001",
  "courseDetails": {
    "course_name": "Bachelor of Software Engineering Honours",
    "university": "NSBM Green University",
    "location": "Pitipana, Homagama",
    "duration": "3-4 Years",
    "study_method": "Full Time",
    "match_score": 85.5,
    "explanation": "This course is well-suited...",
    "career_opportunities": "Software Engineer, System Analyst...",
    "requirements": "GCE A/L in Physical Science...",
    "course_fee": "Rs.850,000.00 per year",
    "department": "School of Computing"
  }
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Roadmap generated successfully",
  "data": {
    "roadmap": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "profileId": "507f1f77bcf86cd799439011",
      "courseId": "NSBM_SE_001",
      "courseName": "Bachelor of Software Engineering Honours",
      "university": "NSBM Green University",
      "careerGoal": "Software Engineer",
      "status": "success",
      "roadmap": [
        {
          "id": 1,
          "title": "Foundation Stage",
          "goal": "Build Strong Programming Fundamentals",
          "icon": "BookOpen",
          "duration": "6-8 Weeks",
          "description": "Start your journey by building...",
          "actionPlan": [
            "Complete Introduction to Computer Science",
            "Practice basic syntax and logic",
            "Build a simple static website"
          ],
          "resources": [
            {
              "title": "MDN Web Docs",
              "url": "https://developer.mozilla.org/"
            }
          ],
          "successCriteria": [
            "Understand variables, loops, functions",
            "Deploy a Hello World project",
            "Commit code to Git repository"
          ],
          "color": "bg-blue-500",
          "lightColor": "bg-blue-50",
          "textColor": "text-blue-600"
        }
        // ... 5 more stages
      ],
      "metadata": {
        "curriculum_focus": "Software Engineering Foundations",
        "languages": ["Python", "Java"],
        "duration_years": 3.0,
        "skill_gaps_count": 8,
        "gap_severity": "high",
        "priority_skills": ["Data Structures & Algorithms", "OOP", "Git"]
      },
      "warnings": [
        "Your course has 8 skill gaps. Consider supplementing..."
      ],
      "createdAt": "2026-02-04T10:30:00.000Z",
      "updatedAt": "2026-02-04T10:30:00.000Z"
    }
  }
}
```

---

### 2. Get Roadmap by ID
**GET** `/api/diagram/:id`

Retrieve a specific roadmap by its ID.

#### Authentication
- **Required**: Yes
- **Type**: Bearer Token (JWT)

#### URL Parameters
- `id` (string, required): Roadmap MongoDB ObjectId

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Roadmap fetched successfully",
  "data": {
    "roadmap": { /* same structure as generate response */ }
  }
}
```

---

### 3. Get All Roadmaps
**GET** `/api/diagram`

Get all roadmaps for the authenticated user.

#### Authentication
- **Required**: Yes
- **Type**: Bearer Token (JWT)

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Roadmaps fetched successfully",
  "data": {
    "roadmaps": [
      { /* roadmap object */ },
      { /* roadmap object */ }
    ]
  }
}
```

---

### 4. Get Roadmap by Profile and Course
**GET** `/api/diagram/profile/:profileId/course/:courseId`

Check if a roadmap already exists for a specific profile and course combination.

#### Authentication
- **Required**: Yes
- **Type**: Bearer Token (JWT)

#### URL Parameters
- `profileId` (string, required): AL Profile MongoDB ObjectId
- `courseId` (string, required): Course ID

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Roadmap fetched successfully",
  "data": {
    "roadmap": { /* roadmap object */ }
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Roadmap not found for this profile and course"
}
```

---

### 5. Delete Roadmap
**DELETE** `/api/diagram/:id`

Soft delete a roadmap (sets `isDeleted: true`).

#### Authentication
- **Required**: Yes
- **Type**: Bearer Token (JWT)

#### URL Parameters
- `id` (string, required): Roadmap MongoDB ObjectId

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Roadmap deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Roadmap API error: 422 - {...}"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied to this profile"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Profile not found or access denied"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Frontend Integration Example

### React/Next.js Usage
```typescript
// services/diagramService.ts
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const diagramService = {
  async generateRoadmap(profileId: string, courseId: string, courseDetails: any) {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE}/diagram/generate`,
      { profileId, courseId, courseDetails },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data.roadmap;
  },

  async getRoadmapById(roadmapId: string) {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_BASE}/diagram/${roadmapId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data.roadmap;
  },

  async checkExistingRoadmap(profileId: string, courseId: string) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${API_BASE}/diagram/profile/${profileId}/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data.roadmap;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }
};

// Usage in component
const handleCourseSelect = async (course) => {
  const profileId = userProfile._id;
  const courseId = course.id;

  // Check if roadmap already exists
  const existing = await diagramService.checkExistingRoadmap(profileId, courseId);
  if (existing) {
    router.push(`/diagram/${existing._id}`);
    return;
  }

  // Generate new roadmap
  const roadmap = await diagramService.generateRoadmap(
    profileId,
    courseId,
    course
  );
  router.push(`/diagram/${roadmap._id}`);
};
```

---

## Data Flow

1. **User selects a course** from recommendations
2. **Frontend calls** `POST /api/diagram/generate` with:
   - `profileId`: User's AL profile ID
   - `courseId`: Selected course ID
   - `courseDetails`: Full course object from recommendation
3. **Node.js server**:
   - Validates request
   - Fetches user profile from MongoDB
   - Calls Python backend `/roadmap/generate`
   - Saves generated roadmap to MongoDB
   - Returns roadmap with colors added
4. **Frontend navigates** to `/diagram/:id` page
5. **Diagram page** displays 6-stage interactive roadmap

---

## Database Schema

### Roadmap Model
```javascript
{
  userId: ObjectId,           // Reference to User
  profileId: ObjectId,        // Reference to ALProfile
  courseId: String,           // Course identifier
  courseName: String,
  university: String,
  careerGoal: String,
  status: 'success' | 'error',
  roadmap: [RoadmapStep],     // 6 stages
  metadata: Object,           // AI metadata
  warnings: [String],
  errors: [String],
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### RoadmapStep Structure
```javascript
{
  id: Number,                 // 1-6
  title: String,
  goal: String,
  icon: String,
  duration: String,
  description: String,
  actionPlan: [String],
  resources: [{
    title: String,
    url: String
  }],
  successCriteria: [String],
  color: String,              // Tailwind class
  lightColor: String,
  textColor: String
}
```

---

## Environment Variables

Add to `.env`:
```env
PYTHON_API_URL=http://localhost:8000
```

---

## Testing

### Using cURL
```bash
# Generate roadmap
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

# Get roadmap by ID
curl -X GET http://localhost:3000/api/diagram/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Notes

- **Caching**: If a roadmap already exists for the same `userId + profileId + courseId`, it returns the existing one instead of regenerating.
- **Soft Delete**: Roadmaps are never permanently deleted; `isDeleted` flag is used.
- **Python Dependency**: Requires Python FastAPI backend running on port 8000.
- **Timeout**: API calls to Python backend have a 30-second timeout.
- **Colors**: The service automatically assigns Tailwind CSS colors to each stage (6 color variations).
