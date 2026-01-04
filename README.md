# AspireAI - Intelligent Career Guidance & Course Recommendation System

## 🎯 Overview

**AspireAI** is an AI-powered career guidance system designed to support Sri Lankan students in making informed educational and career decisions. The system addresses the lack of personalized guidance that often leads students to select unsuitable A/L streams, university programs, or career paths without understanding their academic strengths, interests, and job market opportunities 

The solution consists of four integrated modules: A/L stream recommendation, university program prediction, career guidance for students without O/L or A/L qualifications, and soft skill enhancement. Using machine learning, NLP, time-series analysis, and large language models, the system delivers personalized recommendations, alternative pathways, and adaptive skill development plans.

---

### Problem Statement

Students in Sri Lanka often struggle to make informed education and career decisions due to the lack of structured, personalized guidance. Many students select courses or career paths without clearly understanding how their:

* ✅ Academic performance (O/L, A/L results, Z-scores)
* ✅ Personal interests and career ambitions
* ✅ Eligibility for university or alternative pathways
* ✅ Socio-economic and financial limitations
* ✅ Soft skill readiness for future careers

align with available educational and employment opportunities. This mismatch frequently results in **unsuitable course selections, skill gaps, and limited career prospects, highlighting the need for an intelligent, data-driven career guidance solution tailored to the Sri Lankan context .

## 🏗️ System Architecture Diagram

![AspireAI System Architecture](client/public/RP-Flow.png)


## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5.5 | React framework with SSR |
| React | 19.1.0 | UI library |
| TypeScript | Latest | Type safety |
| Redux Toolkit | 2.9.1 | State management |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 12.23.24 | Animations |
| Axios | 1.12.2 | HTTP client |
| Formik + Yup | Latest | Form handling & validation |
| React Hot Toast | 2.6.0 | Notifications |
| Lucide React | 0.548.0 | Icons |

### Backend Server (Node.js)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4+ | Web framework |
| Sequelize | 6+ | ORM for MySQL |
| MongoDB | Latest | Non-Relational database |
| JWT | Latest | Authentication |
| Bcrypt | Latest | Password hashing |
| Joi | Latest | Validation |

### AI/ML Backend (Python)
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.9+ | Core language |
| FastAPI | Latest | High-performance API framework |
| Uvicorn | Latest | ASGI server |
| Pydantic | Latest | Data validation |

#### LLM Integration
| Provider | Model | Purpose |
|----------|-------|---------|
| Google | Vertex AI (Gemini) | LLM |

#### Vector Databases
| Technology | Purpose |
|------------|---------|
| ChromaDB | Primary vector store |

#### ML/AI Libraries
| Library | Purpose |
|---------|---------|
| Sentence Transformers | Text embeddings |
| PyTorch | Deep learning framework |
| Scikit-learn | ML models (RF, Logistic Regression) |
| XGBoost | Gradient boosting |
| Pandas | Data manipulation |
| NumPy | Numerical computing |

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ and pnpm
- **Python** 3.9+
- **MySQL** 8+
- **Docker** (optional, for containerized deployment)

### 1. Clone Repository
```bash
git clone <repository-url>
cd rp
```

### 2. Backend Setup (Python)
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Build vector index
python scripts/build_index.py

# Run FastAPI server
uvicorn api.main:app --reload --port 8000
```

### 3. Server Setup (Node.js)
```bash
cd server

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run migrations
pnpm db:migrate

# Start server
pnpm dev  # Development mode
# or
pnpm start  # Production mode
```

### 4. Client Setup (Next.js)
```bash
cd client

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with:
# - NEXT_PUBLIC_API_URL (Node.js server)

# Run development server
pnpm dev
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Node.js API**: http://localhost:5000
- **Python API**: http://localhost:8000
---

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```