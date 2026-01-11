# AspireAI - Intelligent Career Guidance & Course Recommendation System

### Topic: Empowering Students with Predictive Intelligence: A Career Guidance System for Sri Lanka
### Main Research Domain: Software System Technologies (SST)
### Project ID: 25-26J-336
### Repo Link: https://github.com/imthadh-ahamed/rp.git

## 📌 Project Overview

**AspireAI** aims to design and develop an **AI-powered adaptive educational and career guidance platform** tailored to the **Sri Lankan education system**. The platform addresses the lack of structured, personalized guidance faced by students at different academic stages by providing **data-driven recommendations**, **soft skill development**, and **inclusive career pathways**.

The system integrates **machine learning, natural language processing (NLP), time-series analysis, and large language models (LLMs)** to deliver personalized guidance for:

* A/L stream selection
* University program prediction
* Career pathways for non-traditional learners
* Soft skill assessment and enhancement

The platform is designed as a **modular, scalable, and privacy-aware web-based system**, supporting diverse student backgrounds and socio-economic conditions.

---

## ❗ Problem Statement

In Sri Lanka, many students make critical educational and career decisions without sufficient insight into how their academic performance, interests, and abilities align with available opportunities. This often leads to:

* Poor academic satisfaction
* Skill mismatches
* Underemployment
* Limited access to guidance for non-traditional learners

Existing guidance systems are largely **static, generic, and exam-centric**, failing to account for:

* Individual interests and ambitions
* Soft skill readiness
* Alternative educational pathways
* Changing labor market trends

This research proposes an **intelligent, adaptive guidance platform** to address these gaps through predictive intelligence and personalization.

---

## 🎯 Research Objectives

### Main Objective

To develop a **data-driven, AI-powered career guidance system** that provides personalized, scalable, and inclusive recommendations for Sri Lankan students across multiple educational pathways.

### Sub-Objectives

* Recommend suitable **A/L streams** based on academic performance and career ambition
* Predict **UGC-approved university programs** using historical admission data
* Provide **career guidance for students without O/L or A/L qualifications**
* Identify and enhance **soft skill gaps** required for academic and career success

---

## 🏗️ System Architecture Diagram

The platform consists of **four intelligent, interconnected modules**, deployed within a centralized web-based architecture:

### 1️⃣ A/L Stream Recommendation Module

* Analyzes term test results, interests, and ambitions
* Predicts suitable A/L streams using ML models
* Provides foundation courses and quizzes for readiness assessment
* Continuously adapts recommendations based on performance

### 2️⃣ University Program Prediction Module

* Uses historical UGC admission data (Z-scores, cutoffs, trends)
* Predicts top 15 eligible university programs
* Integrates quiz-based interest profiling
* Applies time-series forecasting (ARIMA / Prophet)
* Ensures ethical and transparent predictions

### 3️⃣ Career Guidance for Non-Traditional Learners

* Targets students without O/L or A/L qualifications
* Uses adaptive surveys and capability assessments
* Applies ML-based recommendation and rule-based filtering
* Includes ROI estimation and learning-to-earning roadmaps
* Uses LLMs to generate simplified explanations and visual guidance

### 4️⃣ Soft Skill Enhancement Module

* Identifies soft skill gaps via surveys and real-world tasks
* Uses ML and NLP for skill assessment
* Recommends personalized tasks and learning resources
* Tracks progress and adapts recommendations over time

<p align="center">
  <img src="client/public/RP-Flow.png" alt="AspireAI System Architecture" width="650" style="max-width: 100%; height: auto;" />
</p>

---

## 👥 Team Members & Responsibilities

| Name              | Registration No | Responsibility                               |
| ----------------- | --------------- | -------------------------------------------- |
| Bandara R M M K T | IT22897008      | A/L Stream Recommendation                    |
| Ahmed M A A       | IT22079572      | University Program Prediction                |
| Ahamed A L I      | IT22077288      | Career Guidance for Non-Traditional Learners |
| Areeb Aflah N     | IT22146960      | Soft Skill Enhancement                       |

---

## 👨‍🏫 Supervision

* **Supervisor:** Ms. Jenny Krishara 
* **Co-Supervisor:** Ms. Poorna Panduwawala

---

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
- **Mongoose** 9+
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