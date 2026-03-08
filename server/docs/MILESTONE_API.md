# Milestone API Documentation

## Overview
The Milestone API allows users to track their progress through roadmap stages. Each roadmap consists of 6 stages, and users can mark each stage as started, in-progress, or completed with feedback.

## Base URL
```
http://localhost:8080/api/milestones
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create Milestones from Roadmap
Create all 6 milestones for a roadmap at once.

**Endpoint:** `POST /api/milestones`

**Request Body:**
```json
{
  "profileId": "60d5ec49f1b2c72b8c8e4a1b",
  "roadmapId": "60d5ec49f1b2c72b8c8e4a1c",
  "roadmapSteps": [
    {
      "id": 1,
      "title": "Foundation Stage",
      "goal": "Build Strong Programming Fundamentals",
      "duration": "6-8 Weeks"
    },
    {
      "id": 2,
      "title": "Skill Development Stage",
      "goal": "Master Python Development",
      "duration": "8-12 Weeks"
    },
    {
      "id": 3,
      "title": "Real-world Readiness Stage",
      "goal": "Build Real Projects",
      "duration": "10-14 Weeks"
    },
    {
      "id": 4,
      "title": "Performance Strategies Stage",
      "goal": "Optimize Code Performance",
      "duration": "6-10 Weeks"
    },
    {
      "id": 5,
      "title": "Knowledge Expansion Stage",
      "goal": "Learn Advanced Concepts",
      "duration": "8-12 Weeks"
    },
    {
      "id": 6,
      "title": "Industry Polishing Stage",
      "goal": "Prepare for Career",
      "duration": "4-8 Weeks"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Milestones created successfully",
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4a1d",
      "userId": "60d5ec49f1b2c72b8c8e4a1a",
      "profileId": "60d5ec49f1b2c72b8c8e4a1b",
      "roadmapId": "60d5ec49f1b2c72b8c8e4a1c",
      "stepId": 1,
      "stepTitle": "Foundation Stage",
      "stepGoal": "Build Strong Programming Fundamentals",
      "duration": "6-8 Weeks",
      "status": "not_started",
      "feedback": null,
      "completedAt": null,
      "startedAt": null,
      "isDeleted": false,
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    }
    // ... 5 more milestones
  ]
}
```

---

### 2. Get All User Milestones
Retrieve all milestones for the authenticated user.

**Endpoint:** `GET /api/milestones`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User milestones retrieved successfully",
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4a1d",
      "userId": "60d5ec49f1b2c72b8c8e4a1a",
      "profileId": {
        "_id": "60d5ec49f1b2c72b8c8e4a1b",
        "careerGoal": "Software Engineer"
      },
      "roadmapId": {
        "_id": "60d5ec49f1b2c72b8c8e4a1c",
        "courseName": "Computer Science",
        "university": "MIT"
      },
      "stepId": 1,
      "stepTitle": "Foundation Stage",
      "status": "completed",
      "completedAt": "2025-01-15T10:00:00.000Z"
    }
    // ... more milestones
  ]
}
```

---

### 3. Get Milestones by Roadmap
Retrieve all milestones for a specific roadmap.

**Endpoint:** `GET /api/milestones/roadmap/:roadmapId`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Milestones retrieved successfully",
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4a1d",
      "stepId": 1,
      "stepTitle": "Foundation Stage",
      "stepGoal": "Build Strong Programming Fundamentals",
      "duration": "6-8 Weeks",
      "status": "completed",
      "feedback": "Great learning experience! Completed all coding challenges.",
      "completedAt": "2025-01-15T10:00:00.000Z",
      "startedAt": "2025-01-01T10:00:00.000Z",
      "daysSinceStarted": 19,
      "daysToComplete": 14
    },
    {
      "_id": "60d5ec49f1b2c72b8c8e4a1e",
      "stepId": 2,
      "stepTitle": "Skill Development Stage",
      "stepGoal": "Master Python Development",
      "duration": "8-12 Weeks",
      "status": "in_progress",
      "feedback": null,
      "completedAt": null,
      "startedAt": "2025-01-16T10:00:00.000Z",
      "daysSinceStarted": 4,
      "daysToComplete": 0
    }
    // ... 4 more milestones
  ]
}
```

---

### 4. Get Milestone by ID
Retrieve a single milestone by its ID.

**Endpoint:** `GET /api/milestones/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Milestone retrieved successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4a1d",
    "userId": {
      "_id": "60d5ec49f1b2c72b8c8e4a1a",
      "email": "user@example.com"
    },
    "profileId": {
      "_id": "60d5ec49f1b2c72b8c8e4a1b",
      "careerGoal": "Software Engineer"
    },
    "roadmapId": {
      "_id": "60d5ec49f1b2c72b8c8e4a1c",
      "courseName": "Computer Science",
      "university": "MIT",
      "careerGoal": "Software Engineer",
      "roadmap": { /* full roadmap data */ }
    },
    "stepId": 1,
    "stepTitle": "Foundation Stage",
    "stepGoal": "Build Strong Programming Fundamentals",
    "duration": "6-8 Weeks",
    "status": "completed",
    "feedback": "Great learning experience!",
    "completedAt": "2025-01-15T10:00:00.000Z",
    "startedAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### 5. Get Roadmap Progress
Get overall progress statistics for a roadmap.

**Endpoint:** `GET /api/milestones/progress/:roadmapId`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Progress retrieved successfully",
  "data": {
    "total": 6,
    "completed": 2,
    "inProgress": 1,
    "notStarted": 3,
    "percentage": 33,
    "milestones": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4a1d",
        "stepId": 1,
        "stepTitle": "Foundation Stage",
        "status": "completed",
        "completedAt": "2025-01-15T10:00:00.000Z"
      },
      {
        "_id": "60d5ec49f1b2c72b8c8e4a1e",
        "stepId": 2,
        "stepTitle": "Skill Development Stage",
        "status": "completed",
        "completedAt": "2025-01-18T10:00:00.000Z"
      },
      {
        "_id": "60d5ec49f1b2c72b8c8e4a1f",
        "stepId": 3,
        "stepTitle": "Real-world Readiness Stage",
        "status": "in_progress",
        "completedAt": null
      },
      {
        "_id": "60d5ec49f1b2c72b8c8e4a20",
        "stepId": 4,
        "stepTitle": "Performance Strategies Stage",
        "status": "not_started",
        "completedAt": null
      },
      {
        "_id": "60d5ec49f1b2c72b8c8e4a21",
        "stepId": 5,
        "stepTitle": "Knowledge Expansion Stage",
        "status": "not_started",
        "completedAt": null
      },
      {
        "_id": "60d5ec49f1b2c72b8c8e4a22",
        "stepId": 6,
        "stepTitle": "Industry Polishing Stage",
        "status": "not_started",
        "completedAt": null
      }
    ]
  }
}
```

---

### 6. Update Milestone
Update milestone status (e.g., mark as started).

**Endpoint:** `PUT /api/milestones/:id`

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Milestone updated successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4a1d",
    "status": "in_progress",
    "startedAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
}
```

---

### 7. Complete Milestone with Feedback
Mark a milestone as completed and provide feedback.

**Endpoint:** `PUT /api/milestones/:id/complete`

**Request Body:**
```json
{
  "feedback": "This stage was challenging but rewarding. I learned a lot about Python fundamentals and completed all the coding challenges. The resources provided were excellent!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Milestone completed successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4a1d",
    "stepId": 1,
    "stepTitle": "Foundation Stage",
    "status": "completed",
    "feedback": "This stage was challenging but rewarding. I learned a lot about Python fundamentals and completed all the coding challenges. The resources provided were excellent!",
    "completedAt": "2025-01-20T10:00:00.000Z",
    "startedAt": "2025-01-01T10:00:00.000Z",
    "roadmapId": {
      "_id": "60d5ec49f1b2c72b8c8e4a1c",
      "courseName": "Computer Science",
      "university": "MIT"
    }
  }
}
```

---

### 8. Delete Milestone (Soft Delete)
Soft delete a milestone (sets isDeleted to true).

**Endpoint:** `DELETE /api/milestones/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Milestone deleted successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4a1d",
    "isDeleted": true,
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
}
```

---

### 9. Delete All Milestones for a Roadmap
Soft delete all milestones associated with a roadmap.

**Endpoint:** `DELETE /api/milestones/roadmap/:roadmapId`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Milestones deleted successfully",
  "data": {
    "acknowledged": true,
    "matchedCount": 6,
    "modifiedCount": 6
  }
}
```

---

## Error Responses

### 400 Bad Request
Invalid input data or validation errors.
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "roadmapSteps",
      "message": "Roadmap steps must be a non-empty array"
    }
  ]
}
```

### 401 Unauthorized
Missing or invalid authentication token.
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found
Requested milestone not found.
```json
{
  "success": false,
  "message": "Milestone not found"
}
```

### 500 Internal Server Error
Server-side error.
```json
{
  "success": false,
  "message": "Failed to create milestones"
}
```

---

## Status Flow

Milestones follow a three-state flow:

1. **not_started** (default) - Milestone created but not yet started
2. **in_progress** - User has started working on this stage
   - Sets `startedAt` timestamp
3. **completed** - User has finished this stage
   - Sets `completedAt` timestamp
   - Requires feedback (optional)

```
not_started → in_progress → completed
```

---

## UI Integration Flow

### Step 1: Create Milestones
When a user generates a roadmap, automatically create milestones:
```javascript
// After roadmap is created
const roadmapSteps = roadmap.roadmap.map(step => ({
  id: step.id,
  title: step.title,
  goal: step.goal,
  duration: step.duration
}));

await fetch('/api/milestones', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    profileId: roadmap.profileId,
    roadmapId: roadmap._id,
    roadmapSteps
  })
});
```

### Step 2: Display Progress
Show progress at the top of the roadmap page:
```javascript
const response = await fetch(`/api/milestones/progress/${roadmapId}`);
const { total, completed, percentage } = await response.json();

// Display: "2 / 6 steps (33%)"
```

### Step 3: Mark as Started
When user expands a stage or clicks "Start":
```javascript
await fetch(`/api/milestones/${milestoneId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'in_progress' })
});
```

### Step 4: Complete with Feedback
When user clicks "Mark Step as Complete":
```javascript
// Show modal with feedback textarea
const feedback = document.getElementById('feedback').value;

await fetch(`/api/milestones/${milestoneId}/complete`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ feedback })
});

// Show congratulations modal
// Refresh progress display
```

---

## Database Schema

### Milestone Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  profileId: ObjectId (ref: ALProfile),
  roadmapId: ObjectId (ref: Roadmap),
  stepId: Number (1-6),
  stepTitle: String,
  stepGoal: String,
  duration: String,
  status: String (enum: ['not_started', 'in_progress', 'completed']),
  feedback: String (nullable),
  completedAt: Date (nullable),
  startedAt: Date (nullable),
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- `{ roadmapId: 1, stepId: 1 }` - Unique (prevents duplicate milestones)
- `{ userId: 1, isDeleted: 1 }` - Query optimization

### Virtual Fields
- `daysSinceStarted` - Calculates days from startedAt to now
- `daysToComplete` - Calculates days from startedAt to completedAt

---

## Testing with cURL

### Create Milestones
```bash
curl -X POST http://localhost:8080/api/milestones \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "60d5ec49f1b2c72b8c8e4a1b",
    "roadmapId": "60d5ec49f1b2c72b8c8e4a1c",
    "roadmapSteps": [
      {
        "id": 1,
        "title": "Foundation Stage",
        "goal": "Build Strong Programming Fundamentals",
        "duration": "6-8 Weeks"
      }
    ]
  }'
```

### Get Progress
```bash
curl -X GET http://localhost:8080/api/milestones/progress/60d5ec49f1b2c72b8c8e4a1c \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Complete Milestone
```bash
curl -X PUT http://localhost:8080/api/milestones/60d5ec49f1b2c72b8c8e4a1d/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Great learning experience! Completed all challenges."
  }'
```

---

## Notes

1. **Unique Constraint**: Each roadmap can have only one milestone per stepId (1-6). Attempting to create duplicate milestones will return existing ones.

2. **Ownership**: Users can only access, update, and delete their own milestones. The `userId` is automatically set from the authentication token.

3. **Soft Delete**: Deleted milestones are not removed from the database, only marked as deleted (`isDeleted: true`). This preserves historical data.

4. **Feedback**: Feedback is optional when completing a milestone but recommended for tracking learning experiences.

5. **Automatic Timestamps**: When marking a milestone as completed, if `startedAt` is not set, it will be automatically set to the `completedAt` timestamp.

6. **Progress Calculation**: The progress percentage is calculated as `(completed / total) * 100`, rounded to the nearest integer.
