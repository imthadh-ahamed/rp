# AspireAI Server

Backend API server built with Node.js, Express, and Sequelize ORM for PostgreSQL.

## 📁 Project Structure

```
server/
├── config/              # Configuration files
│   ├── database.js      # Database configuration
│   └── sequelize.js     # Sequelize initialization
├── controllers/         # Request handlers
│   └── authController.js
├── middlewares/         # Custom middleware
│   ├── authenticate.js  # JWT authentication
│   ├── errorHandler.js  # Global error handler
│   └── validateRequest.js
├── models/             # Sequelize models
│   ├── User.js
│   └── index.js
├── routes/             # API routes
│   ├── authRoutes.js
│   └── index.js
├── services/           # Business logic
│   └── authService.js
├── utils/              # Utility functions
│   ├── jwt.js
│   └── response.js
├── scripts/            # Database scripts
│   ├── migrate.js      # Run migrations
│   └── seed.js         # Seed database
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js           # Entry point

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Update .env with your database credentials
   ```

3. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE RP;
   ```

4. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Seed database (optional):**
   ```bash
   npm run db:seed
   ```

6. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on **http://localhost:8080**

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Check if API is running

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer <token>
```

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 8080 |
| NODE_ENV | Environment | development |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | Token expiration | 7d |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| DB_NAME | Database name | RP |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_DIALECT | Database dialect | postgres |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |

## 📦 Dependencies

### Main Dependencies
- **express** - Web framework
- **sequelize** - ORM for PostgreSQL
- **pg** - PostgreSQL client
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **express-validator** - Request validation

### Dev Dependencies
- **nodemon** - Auto-restart server on changes

## 🗄️ Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| first_name | STRING | User's first name |
| last_name | STRING | User's last name |
| email | STRING | User's email (unique) |
| password | STRING | Hashed password |
| is_active | BOOLEAN | Account status |
| last_login | DATE | Last login timestamp |
| created_at | DATE | Creation timestamp |
| updated_at | DATE | Update timestamp |

## 🛠️ Scripts

```bash
# Start server in production mode
npm start

# Start server in development mode with auto-reload
npm run dev

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

## 🔐 Security Features

- **Helmet.js** - Secure HTTP headers
- **CORS** - Cross-Origin Resource Sharing
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Input Validation** - Request validation with express-validator

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message"
  }
}
```

## 🧪 Testing the API

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get profile (replace <token> with actual JWT token)
curl -X GET http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer <token>"
```

## 🔄 Adding New Features

### 1. Create a Model
```javascript
// models/YourModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const YourModel = sequelize.define('YourModel', {
  // Define fields here
});

module.exports = YourModel;
```

### 2. Create a Service
```javascript
// services/yourService.js
class YourService {
  async yourMethod() {
    // Business logic here
  }
}

module.exports = new YourService();
```

### 3. Create a Controller
```javascript
// controllers/yourController.js
const yourService = require('../services/yourService');

class YourController {
  async yourHandler(req, res, next) {
    // Handle request
  }
}

module.exports = new YourController();
```

### 4. Create Routes
```javascript
// routes/yourRoutes.js
const express = require('express');
const yourController = require('../controllers/yourController');

const router = express.Router();
router.get('/', yourController.yourHandler);

module.exports = router;
```

### 5. Register Routes
```javascript
// routes/index.js
const yourRoutes = require('./yourRoutes');
router.use('/your-path', yourRoutes);
```

## 📞 Support

For issues and questions, please contact the development team.

## 📄 License

ISC
