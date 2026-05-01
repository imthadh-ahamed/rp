"""
generate_task_list.py
Generates AspireAI_Project_Task_List.docx — a comprehensive SDLC task list
for the AspireAI career guidance platform.
"""

from docx import Document
from docx.shared import Pt, RGBColor, Cm, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import datetime

# ─────────────────────────────────────────────────────────────────────────────
# TASK DATA
# ─────────────────────────────────────────────────────────────────────────────

PHASES = [
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 1: Requirement Gathering",
        "icon": "1",
        "color": "1F3864",
        "description": (
            "Capture and document all functional and non-functional requirements from "
            "stakeholders, domain experts, and end-users before any design or development work begins."
        ),
        "categories": [
            {
                "name": "Stakeholder Engagement",
                "tasks": [
                    {"id": "RG-001", "task": "Conduct kickoff meeting with project sponsor and key stakeholders to align on project vision and objectives", "tag": "General", "status": "Completed"},
                    {"id": "RG-002", "task": "Identify and document all stakeholder groups (students, educators, career counsellors, university administrators)", "tag": "General", "status": "Completed"},
                    {"id": "RG-003", "task": "Conduct structured interviews with target users (Sri Lankan A/L and O/L students) to understand pain points in career guidance", "tag": "General", "status": "Completed"},
                    {"id": "RG-004", "task": "Organise focus group sessions with career counsellors and education experts to gather domain knowledge", "tag": "General", "status": "Completed"},
                    {"id": "RG-005", "task": "Design and distribute student survey (1,000+ responses) on course and career preferences used for ML training data", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Functional Requirements",
                "tasks": [
                    {"id": "RG-006", "task": "Document functional requirements for Module 1: A/L Stream Recommendation (O/L marks-based prediction)", "tag": "Backend / AI/ML", "status": "Completed"},
                    {"id": "RG-007", "task": "Document functional requirements for Module 2: University Program Prediction (Z-score, island rank, district-based)", "tag": "Backend / AI/ML", "status": "Completed"},
                    {"id": "RG-008", "task": "Document functional requirements for Module 3: Career Guidance for Non-Traditional Learners (O/L-only pathways)", "tag": "Backend / AI/ML", "status": "Completed"},
                    {"id": "RG-009", "task": "Document functional requirements for Module 4: Soft Skill Enhancement (communication and problem-solving assessment)", "tag": "Backend / AI/ML", "status": "Completed"},
                    {"id": "RG-010", "task": "Define user authentication and account management requirements (registration, login, JWT token lifecycle)", "tag": "Backend", "status": "Completed"},
                    {"id": "RG-011", "task": "Define requirements for personalised 6-stage learning roadmap generation and milestone tracking", "tag": "Backend / Frontend", "status": "Completed"},
                    {"id": "RG-012", "task": "Define aptitude quiz requirements: stream selection, dynamic question generation, scoring logic", "tag": "AI/ML / Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Non-Functional Requirements",
                "tasks": [
                    {"id": "RG-013", "task": "Define system performance requirements (API response time targets, concurrent user capacity)", "tag": "General", "status": "Completed"},
                    {"id": "RG-014", "task": "Define security requirements (data encryption, OWASP compliance, JWT security, password hashing policy)", "tag": "Backend", "status": "Completed"},
                    {"id": "RG-015", "task": "Define scalability and availability requirements (containerisation, stateless services)", "tag": "General", "status": "Completed"},
                    {"id": "RG-016", "task": "Define multilingual support requirements (Sinhala, Tamil, English language preferences)", "tag": "Frontend / Backend", "status": "Completed"},
                    {"id": "RG-017", "task": "Define data privacy requirements for student personal information and academic records", "tag": "General", "status": "Completed"},
                ],
            },
            {
                "name": "Data Requirements",
                "tasks": [
                    {"id": "RG-018", "task": "Identify and collect UGC-approved university course data (335KB CourseData.json, 231KB CourseData.csv)", "tag": "AI/ML", "status": "Completed"},
                    {"id": "RG-019", "task": "Define required student profile fields for accurate ML predictions (22 O/L subjects, A/L stream, Z-score, district, etc.)", "tag": "AI/ML", "status": "Completed"},
                    {"id": "RG-020", "task": "Document course eligibility rules per A/L stream and minimum Z-score cutoffs from UGC data", "tag": "AI/ML", "status": "Completed"},
                ],
            },
        ],
    },
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 2: Analysis & Planning",
        "icon": "2",
        "color": "1F3864",
        "description": (
            "Analyse gathered requirements, define the technical approach, estimate effort, "
            "and produce a project plan that guides the entire development lifecycle."
        ),
        "categories": [
            {
                "name": "Technical Analysis",
                "tasks": [
                    {"id": "AP-001", "task": "Analyse feasibility of ML-based A/L stream prediction using O/L marks and select appropriate algorithms (XGBoost vs Random Forest vs Logistic Regression)", "tag": "AI/ML", "status": "Completed"},
                    {"id": "AP-002", "task": "Analyse university admission data to determine viable prediction model for top-university recommendations based on Z-score and island rank", "tag": "AI/ML", "status": "Completed"},
                    {"id": "AP-003", "task": "Evaluate and select the RAG architecture (Retrieval-Augmented Generation) for course recommendation over pure LLM or rule-based approaches", "tag": "AI/ML", "status": "Completed"},
                    {"id": "AP-004", "task": "Evaluate LLM providers (Google Vertex AI/Gemini, Anthropic Claude, OpenAI GPT, DeepSeek) and define a multi-provider routing strategy", "tag": "AI/ML", "status": "Completed"},
                    {"id": "AP-005", "task": "Evaluate vector database options (ChromaDB, FAISS, Pinecone, Qdrant) and select ChromaDB as primary local vector store", "tag": "AI/ML", "status": "Completed"},
                    {"id": "AP-006", "task": "Analyse audio feature extraction requirements for soft-skill communication assessment (MFCC, pitch, prosody)", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Technology Stack Selection",
                "tasks": [
                    {"id": "AP-007", "task": "Select Next.js 15 with TypeScript and Tailwind CSS 4 for the frontend, justifying SSR/SSG capabilities and developer productivity", "tag": "Frontend", "status": "Completed"},
                    {"id": "AP-008", "task": "Select Node.js/Express for the user-facing REST API (auth, profiles, diagrams, milestones) and MongoDB for flexible document storage", "tag": "Backend", "status": "Completed"},
                    {"id": "AP-009", "task": "Select Python/FastAPI for the ML/AI microservice, justifying async performance, auto-docs, and Pydantic type safety", "tag": "Backend / AI/ML", "status": "Completed"},
                    {"id": "AP-010", "task": "Select Redux Toolkit for global state management, Formik + Yup for form handling, and Axios with JWT interceptors for HTTP", "tag": "Frontend", "status": "Completed"},
                    {"id": "AP-011", "task": "Select Docker Compose for local multi-service orchestration and define containerisation strategy for all three services", "tag": "General", "status": "Completed"},
                ],
            },
            {
                "name": "Project Planning",
                "tasks": [
                    {"id": "AP-012", "task": "Define project milestones, sprint structure, and delivery schedule aligned with four development modules", "tag": "General", "status": "Completed"},
                    {"id": "AP-013", "task": "Assign roles and responsibilities across frontend, backend, and AI/ML sub-teams", "tag": "General", "status": "Completed"},
                    {"id": "AP-014", "task": "Set up project management tooling (issue tracking, task boards) with task categorisation by module and component", "tag": "General", "status": "Completed"},
                    {"id": "AP-015", "task": "Establish Git branching strategy (feature branches, main/test branch separation) and code review workflow", "tag": "General", "status": "Completed"},
                    {"id": "AP-016", "task": "Define API versioning and integration contract between Node.js server and Python FastAPI backend", "tag": "Backend", "status": "Completed"},
                    {"id": "AP-017", "task": "Create risk register identifying key risks (LLM API quota limits, model accuracy thresholds, data availability)", "tag": "General", "status": "Completed"},
                ],
            },
            {
                "name": "Documentation Planning",
                "tasks": [
                    {"id": "AP-018", "task": "Plan documentation deliverables: API specs (DIAGRAM_API.md, MILESTONE_API.md), architecture docs (AGENTIC_RAG_ARCHITECTURE.md), and model comparison report", "tag": "General", "status": "Completed"},
                    {"id": "AP-019", "task": "Define data collection and labelling plan for ML training datasets (student survey, O/L marks, university cutoffs)", "tag": "AI/ML", "status": "Completed"},
                ],
            },
        ],
    },
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 3: System Design",
        "icon": "3",
        "color": "1F3864",
        "description": (
            "Translate requirements and analysis decisions into concrete system architecture, "
            "database schemas, API contracts, UI wireframes, and ML pipeline blueprints."
        ),
        "categories": [
            {
                "name": "Architecture Design",
                "tasks": [
                    {"id": "SD-001", "task": "Design three-tier architecture: Next.js frontend ↔ Node.js REST API ↔ Python FastAPI ML service, with MongoDB as the primary data store", "tag": "General", "status": "Completed"},
                    {"id": "SD-002", "task": "Design 4-layer Python backend architecture: API Routes → Agent Orchestration → RAG Pipeline → LLM Provider Abstraction", "tag": "AI/ML", "status": "Completed"},
                    {"id": "SD-003", "task": "Design 12-agent Agentic RAG system with specialised agents: Orchestrator, Career Intent, Eligibility, Filtering, Ranking, Explanation, Curriculum, Career Path, Skill Gap, Roadmap Planning, Roadmap Orchestrator", "tag": "AI/ML", "status": "Completed"},
                    {"id": "SD-004", "task": "Design RAG pipeline components: Document Loader → Text Chunker → Nomic Embedder → ChromaDB Vector Store → Semantic Retriever", "tag": "AI/ML", "status": "Completed"},
                    {"id": "SD-005", "task": "Design multi-provider LLM routing strategy with fallback logic across Vertex AI, Anthropic, OpenAI, and DeepSeek", "tag": "AI/ML", "status": "Completed"},
                    {"id": "SD-006", "task": "Design background worker architecture: index_worker, ingestion_worker, refresh_worker for async vector index management", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Database Design",
                "tasks": [
                    {"id": "SD-007", "task": "Design User schema: firstName, lastName, email (unique), hashed password, isActive, lastLogin, timestamps", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-008", "task": "Design ALProfile schema with 20+ fields covering personal details, educational background, career preferences, logistics, and embedded recommendations array", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-009", "task": "Design Roadmap schema: userId, profileId, courseId, courseName, university, careerGoal, 6-stage roadmap array with actionPlan/resources/successCriteria per stage", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-010", "task": "Design Milestone schema with nested 6-stage completion tracking (status, feedback, startedAt, completedAt), progress percentage, and soft-delete support", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-011", "task": "Design MongoDB indexes for performance (userId, createdAt, roadmapId) across all collections", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "API Contract Design",
                "tasks": [
                    {"id": "SD-012", "task": "Design RESTful API contracts for Auth endpoints: POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-013", "task": "Design RESTful API contracts for Profile CRUD: POST/GET/PUT/DELETE /api/profiles with all validation rules and enum constraints", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-014", "task": "Design RESTful API contracts for Roadmap generation and retrieval: POST/GET/DELETE /api/diagram with profile+course linking", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-015", "task": "Design RESTful API contracts for Milestone tracking: 10 endpoints including stage start, stage complete, feedback, and progress reporting", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-016", "task": "Design Python FastAPI Pydantic schemas for all ML endpoints: UserProfile, RecommendationResult, RoadmapRequest/Response, PredictionRequest/Response, QuizRequest/Submission", "tag": "AI/ML", "status": "Completed"},
                    {"id": "SD-017", "task": "Define standardised API response envelope format: { success, data, message, error } for all Node.js endpoints", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Frontend Design",
                "tasks": [
                    {"id": "SD-018", "task": "Design application routing structure: 11 pages including home, auth pages, dashboard, AL-Stream, course recommender, diagram, milestones, profile, career guide", "tag": "Frontend", "status": "Completed"},
                    {"id": "SD-019", "task": "Design reusable UI component library: Button, Card, Badge, Avatar, FormInput, Label, Checkbox, EmptyState, TimelineItem, Toast", "tag": "Frontend", "status": "Completed"},
                    {"id": "SD-020", "task": "Design Redux store structure with user slice for centralised authentication state management", "tag": "Frontend", "status": "Completed"},
                    {"id": "SD-021", "task": "Design Axios HTTP service with JWT interceptor pattern for automatic token injection on all authenticated requests", "tag": "Frontend", "status": "Completed"},
                    {"id": "SD-022", "task": "Design multi-step form flow for UGC Course Recommender: StudentInfoForm → AptitudeTestQuiz → CareerQuiz → ALResultsForm → CourseRecommendations", "tag": "Frontend", "status": "Completed"},
                    {"id": "SD-023", "task": "Design 6-stage visual roadmap component with quick navigation, expandable explanation sections, and milestone progress display", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Security Design",
                "tasks": [
                    {"id": "SD-024", "task": "Design JWT authentication flow: 7-day token expiry, Bearer token extraction middleware, cookie storage with 7-day expiry on frontend", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-025", "task": "Design password security: bcrypt hashing with 10-salt rounds, password exclusion from all API responses", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-026", "task": "Design CORS policy: origin whitelisting for localhost:3000, credentials support for cookie-based auth", "tag": "Backend", "status": "Completed"},
                    {"id": "SD-027", "task": "Design Helmet.js security header configuration: XSS protection, clickjacking prevention, MIME-type sniffing prevention", "tag": "Backend", "status": "Completed"},
                ],
            },
        ],
    },
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 4: Frontend Development",
        "icon": "4",
        "color": "1F3864",
        "description": (
            "Build all client-side screens, components, state management, API integration, "
            "and UI/UX features using Next.js 15, React 19, TypeScript, and Tailwind CSS."
        ),
        "categories": [
            {
                "name": "Project Setup & Configuration",
                "tasks": [
                    {"id": "FE-001", "task": "Initialise Next.js 15 project with TypeScript, Tailwind CSS 4, and Turbopack build configuration", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-002", "task": "Configure Redux Toolkit store with user slice and persistence via LocalStorage utility", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-003", "task": "Set up Axios HTTP service with JWT Bearer token interceptor reading from cookies via js-cookie", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-004", "task": "Configure Next.js route middleware for dashboard protection: redirect to home if no valid JWT token in cookies", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-005", "task": "Set up next-themes for dark/light mode support and configure AOS (Animate On Scroll) library", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-006", "task": "Implement Aoscompo component for AOS animation initialisation on page load", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Authentication Pages & Components",
                "tasks": [
                    {"id": "FE-007", "task": "Build login page (/login) with LoginForm and LoginBranding components using Formik + Yup validation", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-008", "task": "Build signup page (/signup) with SignUpForm and SignUpBranding components, all required field validation", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-009", "task": "Build forgot-password page with email input and submission flow", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-010", "task": "Implement AuthLoader common component: initialises auth state on app load, validates token, populates Redux store", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-011", "task": "Implement auth.service.ts: register(), login(), getCurrentUser(), logout() with token/user storage management", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Layout & Common Components",
                "tasks": [
                    {"id": "FE-012", "task": "Build AppShell layout wrapper with Header, Footer, and responsive page layout", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-013", "task": "Build responsive Header component with navigation links and authenticated user display", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-014", "task": "Build Footer component with project links and branding", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-015", "task": "Build AIAssistant chat widget component for in-app user guidance", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-016", "task": "Build ConfirmModal reusable dialog component for destructive action confirmations", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-017", "task": "Build complete UI component library: Button, Card, Badge, Avatar, FormInput, Label, Checkbox, EmptyState, TimelineItem, IconBox, IconButton, Toast, SectionHeader, Grid, FormDivider, SocialButton", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Home & Dashboard",
                "tasks": [
                    {"id": "FE-018", "task": "Build landing page (/) with hero section, feature cards, call-to-action, AOS scroll animations, and Framer Motion transitions", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-019", "task": "Build protected dashboard page (/dashboard) displaying user profile summary and module navigation", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-020", "task": "Build profile page (/profile) with user account details display and edit functionality", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "A/L Stream Module (Frontend)",
                "tasks": [
                    {"id": "FE-021", "task": "Build IntegratedALApp main container for A/L stream recommendation module (/AL-Stream)", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-022", "task": "Build ALStreamPredictor component with subject mark input interface for O/L-based prediction", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-023", "task": "Build BasketSelector component for subject basket selection and stream filtering", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-024", "task": "Build PredictorResults component with StreamComparisonCard for displaying prediction probabilities", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-025", "task": "Build Quiz sub-module: QuizStart, QuizQuestion, QuizResults, QuizSidebar, QuizApp components for aptitude-based stream assessment", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-026", "task": "Build shared AL-Stream components: ALStreamHeader, ErrorAlert, LoadingSpinner, StatCard", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "UGC Course Recommender Module (Frontend)",
                "tasks": [
                    {"id": "FE-027", "task": "Build multi-step UGC Course Recommender page (/ugc-course-recommender) with ProgressIndicator", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-028", "task": "Build StudentInfoForm for collecting student academic data (stream, O/L results, A/L results, location)", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-029", "task": "Build AptitudeTestQuiz component with 10-question interest assessment and real-time scoring", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-030", "task": "Build CareerQuiz component for career preference assessment with weighted scoring", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-031", "task": "Build ALResultsForm for A/L qualified students to input Z-score, island rank, and subject grades", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-032", "task": "Build CourseRecommendations component to display ranked top-10 courses with match scores and details", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Course Suggestion Module (Frontend)",
                "tasks": [
                    {"id": "FE-033", "task": "Build course suggestion page (/course-suggestion) with CourseList, CourseDetailModal, and CourseSelectionModal", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-034", "task": "Build CourseDetailModal with full course information: university, requirements, career opportunities, study method, fees", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-035", "task": "Implement course selection state management: visual selection indicator, selected-course persistence for roadmap generation", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Roadmap / Diagram Module (Frontend)",
                "tasks": [
                    {"id": "FE-036", "task": "Build visual roadmap page (/diagram) with 6-stage VisualRoadmap component", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-037", "task": "Build ExplanationSection component with expand/collapse toggle for actionPlan, resources, and successCriteria per stage", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-038", "task": "Build QuickNavigation component with smooth-scroll anchor links to each of the 6 roadmap stages", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-039", "task": "Integrate diagram.service.ts for roadmap API calls: generateRoadmap(), getRoadmap(), getRoadmapByProfileAndCourse()", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Milestone Tracking Module (Frontend)",
                "tasks": [
                    {"id": "FE-040", "task": "Build milestones page (/milestones) with MilestonesTab/ProfileTab navigation", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-041", "task": "Build MilestoneCard component showing stage status (pending/in_progress/completed), progress bar, and action buttons", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-042", "task": "Build MilestoneDetailsView for expanded 6-stage roadmap progress tracking with per-stage actions", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-043", "task": "Build FeedbackModal for collecting stage completion feedback with text area and confirm/cancel actions", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-044", "task": "Build CelebrationModal triggered on 100% milestone completion with congratulatory animation", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-045", "task": "Integrate milestone.service.ts for all milestone API calls: create, get, startStage, completeStage, updateFeedback, delete", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Career Guide Module (Frontend)",
                "tasks": [
                    {"id": "FE-046", "task": "Build career guide page (/career-guide) with module intro, OL/AL pathway selection, and next-steps display", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-047", "task": "Build ALForm and OLForm components for qualification-based pathway filtering", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-048", "task": "Build AssessmentModal for capability self-assessment and NextStepsSection for recommended career pathways", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-049", "task": "Build SuccessStories component with case studies for non-traditional learner pathways", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Skill Assessment Sub-App (Frontend)",
                "tasks": [
                    {"id": "FE-050", "task": "Build standalone skill assessment sub-application (/skill) with its own routing structure", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-051", "task": "Build communication skill assessment page with voice/audio recording interface (ComSection component)", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-052", "task": "Build critical-thinking and problem-solving assessment pages with scoring display", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-053", "task": "Build skill recommendation results page with personalised course suggestions based on assessed skill levels", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-054", "task": "Implement PropertyContext for skill module state management and data sharing across skill assessment pages", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Services & Utilities",
                "tasks": [
                    {"id": "FE-055", "task": "Implement profile.service.ts for ALProfile CRUD API calls: create, get, update, delete profile", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-056", "task": "Implement aptitudeApi.ts for quiz API calls: getStreams(), getStreamInfo(), generateQuiz(), submitQuiz()", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-057", "task": "Implement custom usePredictions hook for encapsulating stream prediction and university prediction logic", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-058", "task": "Implement TypeScript type definitions: api.types.ts, predictor.types.ts, profile.types.ts, milestone.types.ts, diagram.types.ts", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-059", "task": "Implement ugcCourseData.ts with curated course database and client-side recommendationEngine.ts for hybrid scoring", "tag": "Frontend", "status": "Completed"},
                    {"id": "FE-060", "task": "Implement milestoneStorage.ts and userStorage.ts for localStorage persistence of application state", "tag": "Frontend", "status": "Completed"},
                ],
            },
        ],
    },
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 5: Backend Development (Node.js)",
        "icon": "5",
        "color": "1F3864",
        "description": (
            "Build the RESTful API server handling user authentication, profile management, "
            "roadmap orchestration, and milestone tracking using Node.js, Express, and MongoDB."
        ),
        "categories": [
            {
                "name": "Project Setup & Configuration",
                "tasks": [
                    {"id": "BE-001", "task": "Initialise Node.js/Express project with pnpm, configure ESLint, and establish folder structure (routes, controllers, models, middlewares, validations, docs)", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-002", "task": "Configure MongoDB connection via Mongoose with connection error handling and environment-based URI switching", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-003", "task": "Configure Helmet.js for security headers, Morgan for HTTP request logging, and CORS for frontend origin whitelisting", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-004", "task": "Set up environment variable management with dotenv and define all required variables (MONGO_URI, JWT_SECRET, JWT_EXPIRE, PORT, CORS_ORIGIN)", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-005", "task": "Configure database migrations using Umzug for schema versioning and data migrations", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-006", "task": "Implement globalised error handling middleware with standardised error response format", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Authentication Module",
                "tasks": [
                    {"id": "BE-007", "task": "Implement User Mongoose model with bcrypt pre-save password hashing, comparePassword instance method, and password exclusion from JSON output", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-008", "task": "Implement POST /api/auth/register endpoint with express-validator rules: firstName/lastName required, email format, password min 6 chars", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-009", "task": "Implement POST /api/auth/login endpoint: credential validation, bcrypt comparison, JWT signing with 7-day expiry", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-010", "task": "Implement GET /api/auth/profile protected endpoint returning authenticated user data without password", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-011", "task": "Implement JWT authenticate middleware: Bearer token extraction from Authorization header, token verification, user attachment to req.user", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-012", "task": "Implement validateRequest middleware using express-validator for centralised validation error collection and 422 response formatting", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "A/L Profile Module",
                "tasks": [
                    {"id": "BE-013", "task": "Implement ALProfile Mongoose model with 20+ fields, enum validation (gender, alStream, interestArea, fundingMethod, availability, completionPeriod, studyMethod), and embedded recommendations array", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-014", "task": "Implement POST /api/profiles with full field validation including all enum constraints for gender, native language, interest area, and logistics fields", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-015", "task": "Implement GET /api/profiles (all user profiles), GET /api/profiles/:id (single profile with ObjectId validation)", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-016", "task": "Implement PUT /api/profiles/:id with ownership check (userId match) and partial update support for all profile fields", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-017", "task": "Implement DELETE /api/profiles/:id with ownership verification and soft-delete (isDeleted flag)", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Roadmap (Diagram) Module",
                "tasks": [
                    {"id": "BE-018", "task": "Implement Roadmap Mongoose model with 6-stage array structure (id, title, goal, duration, description, actionPlan[], resources[], successCriteria[]) and metadata fields", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-019", "task": "Implement POST /api/diagram: validate profileId (ObjectId) and courseId, fetch user profile, call Python /roadmap/generate endpoint, store and return generated roadmap", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-020", "task": "Implement GET /api/diagram (all user roadmaps), GET /api/diagram/:id (single roadmap)", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-021", "task": "Implement GET /api/diagram/profile/:profileId/course/:courseId for roadmap lookup by profile-course combination", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-022", "task": "Implement DELETE /api/diagram/:id with ownership check and soft-delete", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-023", "task": "Write DIAGRAM_API.md and DIAGRAM_IMPLEMENTATION.md documenting all roadmap endpoints with example requests and responses", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Milestone Tracking Module",
                "tasks": [
                    {"id": "BE-024", "task": "Implement Milestone Mongoose model with nested 6-stage completion schema: status (pending/in_progress/completed), feedback, startedAt, completedAt, actionPlan, resources, successCriteria", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-025", "task": "Implement Milestone model methods: markStageAsStarted(), markStageAsComplete(), updateStageFeedback() with automatic progressPercentage and overallStatus calculation", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-026", "task": "Implement POST /api/milestones with strict validation: exactly 6 stages (min/max), stepId range 1-6, all required stage fields", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-027", "task": "Implement GET /api/milestones, GET /api/milestones/roadmap/:roadmapId, GET /api/milestones/:id, GET /api/milestones/progress/:roadmapId", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-028", "task": "Implement PUT /api/milestones/:id (update metadata), PUT /api/milestones/:id/stage/start (mark in_progress with timestamp)", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-029", "task": "Implement PUT /api/milestones/:id/stage/complete (mark completed, record feedback, update progress), PUT /api/milestones/:id/stage/feedback (update stage feedback text)", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-030", "task": "Implement DELETE /api/milestones/:id with soft-delete and write MILESTONE_API.md documentation", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Health, Routing & Integration",
                "tasks": [
                    {"id": "BE-031", "task": "Implement GET /api/health endpoint returning service status, uptime, and environment information", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-032", "task": "Implement centralised route index aggregating all route modules with /api prefix", "tag": "Backend", "status": "Completed"},
                    {"id": "BE-033", "task": "Implement Axios-based HTTP client in Node.js server for calling Python FastAPI /roadmap/generate with user profile data", "tag": "Backend", "status": "Completed"},
                ],
            },
        ],
    },
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 6: AI/ML Development",
        "icon": "6",
        "color": "1F3864",
        "description": (
            "Build all machine learning models, RAG pipelines, agentic orchestration systems, "
            "and LLM integrations that power the platform's four intelligent modules."
        ),
        "categories": [
            {
                "name": "Data Collection & Preprocessing",
                "tasks": [
                    {"id": "ML-001", "task": "Collect and curate UGC-approved university course dataset (CourseData.json 335KB, CourseData.csv 231KB) including course requirements, fees, study methods, locations", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-002", "task": "Design and collect student career and course preference survey with 1,000+ responses (Student_Course_Career_Path_Survey.json 1.2MB)", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-003", "task": "Collect and clean tech career pathway data (Tech_Data_Cleaned.csv 509KB) for career guidance module", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-004", "task": "Extract and compile university admission cutoffs (Z-scores, island ranks) per course and district from UGC data", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-005", "task": "Implement data conversion scripts: convert_csv_json.py, clean_json.py for data format standardisation", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-006", "task": "Implement course data ingestion pipeline: ingest_courses.py to load CourseData into ChromaDB with structured metadata", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "RAG Pipeline Development",
                "tasks": [
                    {"id": "ML-007", "task": "Implement document loader (loader.py) for ingesting JSON/CSV course data and PDF documents into the RAG pipeline", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-008", "task": "Implement text chunker (chunker.py) for splitting course documents into overlapping semantic chunks for vector indexing", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-009", "task": "Implement Nomic embedder (nomic_embedder.py) for generating dense vector embeddings from course text using Sentence Transformers", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-010", "task": "Implement ChromaDB vector store (chroma_store.py) as primary persistent vector database for course embeddings", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-011", "task": "Implement FAISS local vector store (faiss_store.py) for offline/alternative vector retrieval", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-012", "task": "Implement Pinecone cloud vector store (pinecone_store.py) for scalable cloud-based retrieval option", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-013", "task": "Implement Qdrant vector store (qdrant_store.py) as additional cloud vector DB option", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-014", "task": "Implement semantic retriever (retriever.py) with top-K ANN search against ChromaDB for candidate course retrieval", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-015", "task": "Implement end-to-end RAG pipeline (pipeline.py) orchestrating load → chunk → embed → index → retrieve flow", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-016", "task": "Implement build_index.py script to construct and persist the ChromaDB vector index from course data", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "LLM Integration",
                "tasks": [
                    {"id": "ML-017", "task": "Implement Google Vertex AI (Gemini) client (vertex_client.py) for LLM text generation used in explanations and roadmap planning", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-018", "task": "Implement Anthropic Claude client (anthropic_client.py) as alternative LLM provider", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-019", "task": "Implement OpenAI GPT client (openai_client.py) and DeepSeek client (deepseek_client.py) for provider diversity", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-020", "task": "Implement LLM model router (model_router.py) with provider selection logic and hardware detection utility for GPU optimisation", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Agentic Recommendation System (12 Agents)",
                "tasks": [
                    {"id": "ML-021", "task": "Implement main Orchestrator agent (orchestrator.py): 6-step agentic pipeline coordinating validation, RAG retrieval, eligibility filtering, preference filtering, ranking, and explanation generation", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-022", "task": "Implement Career Intent agent (career_intent.py) for analysing and categorising user career goals from free-text input", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-023", "task": "Implement Eligibility agent (eligibility_agent.py): rule-based filtering by A/L stream eligibility, minimum Z-score, qualification requirements", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-024", "task": "Implement Filtering agent (filtering_agent.py): preference-based filtering by study method (Hybrid/Online/Onsite), location, duration, and funding method", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-025", "task": "Implement Ranking agent (ranking_agent.py): multi-factor ranking combining semantic similarity score, eligibility, preference alignment, and match_score calculation", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-026", "task": "Implement Explanation agent (explanation_agent.py): LLM-powered generation of personalised course explanations with career_opportunities and match rationale", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-027", "task": "Implement Curriculum agent (curriculum_agent.py 18KB): detailed course curriculum analysis for roadmap stage planning", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-028", "task": "Implement Career Path agent (career_path_agent.py 30KB): comprehensive career pathway mapping from course to career outcomes", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-029", "task": "Implement Skill Gap agent (skill_gap_agent.py): identification of skill gaps between student profile and course requirements", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-030", "task": "Implement Roadmap Planning agent (roadmap_planning_agent.py 70KB): detailed 6-stage learning path generation with action plans, resources, and success criteria per stage", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-031", "task": "Implement Roadmap Orchestrator (roadmap_orchestrator.py): coordinates Curriculum, Career Path, Skill Gap, and Planning agents to produce cohesive 6-stage roadmap", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "ML Model Development: A/L Stream Prediction",
                "tasks": [
                    {"id": "ML-032", "task": "Prepare training dataset from student survey: extract O/L subject marks (13 subjects) and A/L stream labels from 1,000+ student records", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-033", "task": "Train and evaluate XGBoost A/L stream classifier (xgboost_al_stream_model.json 6.1MB) achieving optimal accuracy vs. Random Forest and Logistic Regression", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-034", "task": "Implement al_predictor_service.py wrapper for loading XGBoost model and exposing stream prediction with probability output per stream", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-035", "task": "Implement POST /api/predict/al_stream endpoint accepting O/L marks for all subjects and returning stream probabilities", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-036", "task": "Implement GET /api/predict/streams and GET /api/predict/baskets endpoints for dynamic stream and subject configuration", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "ML Model Development: University Prediction",
                "tasks": [
                    {"id": "ML-037", "task": "Prepare training features for university prediction model: Z-score, island rank, district, stream, subject grades, 12 aptitude scores (q1-q12)", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-038", "task": "Train XGBoost university admission classifier and evaluate on holdout data; document results in MODEL_COMPARISON_REPORT.md", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-039", "task": "Implement POST /predict endpoint accepting StudentProfileRequest and returning top-10 university predictions with admission probabilities", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-040", "task": "Implement POST /predict/batch for bulk student-to-university prediction with per-student error handling", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-041", "task": "Implement rule-based course recommender (rule_recommend.py) as deterministic fallback using Z-score cutoffs, stream eligibility, and interest Q-score alignment", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-042", "task": "Implement POST /predict/combined endpoint: integrate course ML model + university ML model for single-request course-with-university recommendation", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Quiz Generation Module",
                "tasks": [
                    {"id": "ML-043", "task": "Build aptitude-ai standalone FastAPI sub-application with its own RAG pipeline for quiz data", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-044", "task": "Implement quiz RAG pipeline: JSON/PDF data ingestion, text chunking, vector embedding, and Groq LLM-based question generation", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-045", "task": "Implement BERT-based question validator (bert_validator.py) and duplicate checker for quiz quality control", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-046", "task": "Implement POST /api/quiz/generate endpoint: stream-specific MCQ generation with configurable question count (1-20)", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-047", "task": "Implement POST /api/quiz/submit endpoint: answer comparison, score calculation, percentage scoring, and per-question result detail", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-048", "task": "Implement build_rag_pipeline.py and generate_quiz_pipeline.py scripts for pipeline construction and quiz generation workflows", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Soft Skill Assessment Module",
                "tasks": [
                    {"id": "ML-049", "task": "Implement audio feature extraction (featureExtraction.py): MFCC coefficients, pitch, prosody, and temporal features from communication audio samples", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-050", "task": "Train communication skill ML models: regression for score prediction and classification for skill level assignment", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-051", "task": "Implement predict_pipeline.py for end-to-end skill prediction: audio input → feature extraction → ML inference → skill score", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-052", "task": "Implement skill-based course recommender (recommender.py) that maps assessed skill levels to appropriate course recommendations", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-053", "task": "Implement POST /predict-and-recommend (problem-solving) and POST /evaluate-communication (audio) endpoints", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Background Workers & Services",
                "tasks": [
                    {"id": "ML-054", "task": "Implement index_worker.py for background vector index building without blocking the API server", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-055", "task": "Implement ingestion_worker.py for async course data ingestion and embedding computation", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-056", "task": "Implement refresh_worker.py for scheduled vector index refresh when course data is updated", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Model Evaluation & Documentation",
                "tasks": [
                    {"id": "ML-057", "task": "Implement test scripts: test_api.py, test_rag.py, test_agents.py, test_embedding.py, test_retrieval.py for component-level testing", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-058", "task": "Run demo_roadmap_system.py end-to-end demonstration and document sample outputs", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-059", "task": "Write MODEL_COMPARISON_REPORT.md documenting accuracy, precision, recall, F1 scores for all trained models", "tag": "AI/ML", "status": "Completed"},
                    {"id": "ML-060", "task": "Write AGENTIC_RAG_ARCHITECTURE.md documenting the 12-agent pipeline, data flow, and design decisions", "tag": "AI/ML", "status": "Completed"},
                ],
            },
        ],
    },
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 7: Integration",
        "icon": "7",
        "color": "1F3864",
        "description": (
            "Connect all three application tiers into a cohesive system, verify end-to-end "
            "data flows, and resolve cross-service compatibility issues."
        ),
        "categories": [
            {
                "name": "Frontend ↔ Node.js Integration",
                "tasks": [
                    {"id": "INT-001", "task": "Integrate frontend auth flows with Node.js: connect LoginForm to POST /api/auth/login, store JWT in cookies, initialise Redux user state via AuthLoader", "tag": "Frontend / Backend", "status": "Completed"},
                    {"id": "INT-002", "task": "Integrate SignUpForm with POST /api/auth/register and handle 400 duplicate-email and 422 validation error responses in UI", "tag": "Frontend / Backend", "status": "Completed"},
                    {"id": "INT-003", "task": "Integrate profile.service.ts with all ALProfile endpoints: verify profile creation, retrieval, and update flows from the frontend form", "tag": "Frontend / Backend", "status": "Completed"},
                    {"id": "INT-004", "task": "Integrate diagram.service.ts with POST /api/diagram: wire selected course + profile to roadmap generation, display 6-stage result on /diagram page", "tag": "Frontend / Backend", "status": "Completed"},
                    {"id": "INT-005", "task": "Integrate milestone.service.ts: wire MilestonesTab to all 10 milestone API endpoints, validate stage lifecycle (pending → in_progress → completed)", "tag": "Frontend / Backend", "status": "Completed"},
                    {"id": "INT-006", "task": "Validate JWT token expiry handling: verify 401 responses correctly redirect users to login page from all authenticated pages", "tag": "Frontend / Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Node.js ↔ Python FastAPI Integration",
                "tasks": [
                    {"id": "INT-007", "task": "Integrate Node.js diagram controller with Python /roadmap/generate: map ALProfile fields to RoadmapRequest schema, handle timeout and error responses", "tag": "Backend / AI/ML", "status": "Completed"},
                    {"id": "INT-008", "task": "Validate data mapping between Node.js ALProfile model and Python UserProfile Pydantic schema for all 14 profile fields", "tag": "Backend / AI/ML", "status": "Completed"},
                    {"id": "INT-009", "task": "Test roundtrip: Profile creation → Roadmap generation → 6-stage response → Milestone creation from roadmap stages", "tag": "Backend / AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Frontend ↔ Python FastAPI Direct Integration",
                "tasks": [
                    {"id": "INT-010", "task": "Integrate UGC Course Recommender multi-step form with Python /recommend endpoint: map form fields to UserProfile JSON payload", "tag": "Frontend / AI/ML", "status": "Completed"},
                    {"id": "INT-011", "task": "Integrate AL-Stream predictor interface with Python /api/predict/al_stream: send O/L marks, display stream probabilities on PredictorResults component", "tag": "Frontend / AI/ML", "status": "Completed"},
                    {"id": "INT-012", "task": "Integrate ALResultsForm (Z-score, rank, district, subjects) with Python /predict/combined for university + course prediction", "tag": "Frontend / AI/ML", "status": "Completed"},
                    {"id": "INT-013", "task": "Integrate aptitudeApi.ts with /api/quiz/generate and /api/quiz/submit endpoints: verify quiz flow from stream selection to score display", "tag": "Frontend / AI/ML", "status": "Completed"},
                    {"id": "INT-014", "task": "Integrate skill assessment sub-app audio interface with Python /evaluate-communication endpoint", "tag": "Frontend / AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Cross-Service Concerns",
                "tasks": [
                    {"id": "INT-015", "task": "Configure and validate CORS headers across all three services: Node.js (localhost:3000), Python FastAPI (localhost:3000, 8080)", "tag": "General", "status": "Completed"},
                    {"id": "INT-016", "task": "Validate end-to-end API response envelope consistency across all Node.js endpoints: { success, data, message } format", "tag": "Backend", "status": "Completed"},
                    {"id": "INT-017", "task": "Implement and validate health check endpoints for all services: GET /api/health (Node.js) and GET /health + GET /roadmap/health (Python)", "tag": "General", "status": "Completed"},
                    {"id": "INT-018", "task": "Validate Docker Compose network bridge allows Node.js container to reach Python FastAPI container by service name", "tag": "General", "status": "Completed"},
                ],
            },
        ],
    },
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 8: Testing & Quality Assurance",
        "icon": "8",
        "color": "1F3864",
        "description": (
            "Verify system correctness, reliability, and security through unit testing, "
            "API testing, ML model validation, end-to-end testing, and performance testing."
        ),
        "categories": [
            {
                "name": "Unit Testing",
                "tasks": [
                    {"id": "QA-001", "task": "Write Jest unit tests for Node.js auth endpoints: register (success, duplicate email, validation errors), login (success, wrong password, invalid format)", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-002", "task": "Write Jest unit tests for JWT token generation, validation, and expiry handling (jwt.test.js)", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-003", "task": "Write Jest unit tests for ALProfile CRUD operations covering all enum validations and ownership checks", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-004", "task": "Write Jest unit tests for Milestone model methods: markStageAsStarted, markStageAsComplete, progressPercentage calculation", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-005", "task": "Write Python unit tests for RAG pipeline components: loader, chunker, embedder, retriever (test_rag.py, test_embedding.py, test_retrieval.py)", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-006", "task": "Write Python unit tests for agent components: test_agents.py covering eligibility filtering, ranking, explanation generation", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "API / Integration Testing",
                "tasks": [
                    {"id": "QA-007", "task": "Write Supertest API integration tests for all Node.js auth endpoints with test database setup/teardown (testSetup.js helpers)", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-008", "task": "Write integration tests for Milestone stage lifecycle: create → start stage → complete stage → verify progress percentage", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-009", "task": "Write Python integration tests (test_api.py) for all FastAPI endpoints: recommend, predict, quiz generate/submit, roadmap generate", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-010", "task": "Test Node.js → Python integration: simulate roadmap generation request flow end-to-end with real profile data", "tag": "Backend / AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "ML Model Validation",
                "tasks": [
                    {"id": "QA-011", "task": "Evaluate XGBoost A/L stream prediction model: accuracy, per-class precision/recall/F1, confusion matrix on test split", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-012", "task": "Evaluate XGBoost university prediction model: top-10 accuracy, NDCG ranking score, per-university precision", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-013", "task": "Evaluate RAG retrieval quality: precision@K, recall@K, MRR for course retrieval against ground-truth relevant courses", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-014", "task": "Validate LLM-generated roadmaps for stage coherence, completeness (6 stages), and relevance to selected course and career goal", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-015", "task": "Validate soft skill audio assessment model: MSE for regression score, classification accuracy for skill level on held-out test audio", "tag": "AI/ML", "status": "Completed"},
                ],
            },
            {
                "name": "Frontend Testing",
                "tasks": [
                    {"id": "QA-016", "task": "Test all frontend form validations: login empty submit, signup invalid email, signup short password, profile invalid enum values", "tag": "Frontend", "status": "Completed"},
                    {"id": "QA-017", "task": "Test route protection middleware: verify unauthenticated access to /dashboard redirects to home", "tag": "Frontend", "status": "Completed"},
                    {"id": "QA-018", "task": "Test multi-step UGC form flow: verify state persistence across form steps and correct data sent to recommendation API", "tag": "Frontend", "status": "Completed"},
                    {"id": "QA-019", "task": "Test milestone UI lifecycle: start stage button → in_progress state → complete stage → feedback modal → celebration modal on 100% completion", "tag": "Frontend", "status": "Completed"},
                    {"id": "QA-020", "task": "Test responsive design across viewport sizes: mobile (375px), tablet (768px), desktop (1280px+)", "tag": "Frontend", "status": "Completed"},
                ],
            },
            {
                "name": "Security Testing",
                "tasks": [
                    {"id": "QA-021", "task": "Test authentication bypass: verify all protected endpoints return 401 without valid JWT token", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-022", "task": "Test authorisation enforcement: verify users cannot access, update, or delete other users' profiles, roadmaps, or milestones", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-023", "task": "Test input injection: attempt SQL injection and NoSQL injection patterns on all API endpoints, verify safe rejection", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-024", "task": "Test JWT token security: verify expired tokens are rejected, tampered tokens return 401, and password is never returned in any response", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-025", "task": "Verify Helmet.js security headers are present on all Node.js API responses", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Performance Testing",
                "tasks": [
                    {"id": "QA-026", "task": "Benchmark FastAPI recommendation endpoint: measure p50/p95/p99 latency under simulated concurrent user load", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-027", "task": "Benchmark RAG retrieval latency: measure ChromaDB semantic search time for top-K retrieval across varying corpus sizes", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-028", "task": "Benchmark roadmap generation end-to-end latency: profile input to 6-stage response including LLM API call time", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-029", "task": "Benchmark Node.js API throughput: measure requests/second for auth and milestone endpoints under load", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Code Review",
                "tasks": [
                    {"id": "QA-030", "task": "Conduct code review for all Node.js route/controller/model files: verify consistent error handling, validation completeness, and security practices", "tag": "Backend", "status": "Completed"},
                    {"id": "QA-031", "task": "Conduct code review for Python agent and RAG pipeline components: verify prompt engineering quality, error resilience, and LLM response parsing", "tag": "AI/ML", "status": "Completed"},
                    {"id": "QA-032", "task": "Conduct code review for frontend services and components: verify TypeScript typing, API error handling, and accessibility compliance", "tag": "Frontend", "status": "Completed"},
                    {"id": "QA-033", "task": "Review and validate all Pydantic schemas against actual data shapes from course JSON and survey data", "tag": "AI/ML", "status": "Completed"},
                ],
            },
        ],
    },
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 9: Deployment",
        "icon": "9",
        "color": "1F3864",
        "description": (
            "Package, containerise, and deploy all application services. "
            "Configure CI/CD pipelines and verify the production deployment."
        ),
        "categories": [
            {
                "name": "Containerisation",
                "tasks": [
                    {"id": "DEP-001", "task": "Write Dockerfile for Node.js/Express server: Node.js 18 base image, dependency install, environment injection, port 8080 exposure", "tag": "Backend", "status": "Completed"},
                    {"id": "DEP-002", "task": "Write Dockerfile for Next.js frontend: Node.js base, pnpm install, Next.js build, port 3000 exposure", "tag": "Frontend", "status": "Completed"},
                    {"id": "DEP-003", "task": "Write Dockerfile for Python/FastAPI backend: Python 3.9+ base image, pip install from requirements.txt, Uvicorn start command", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DEP-004", "task": "Write docker-compose.yml orchestrating all three services with bridge network, environment variable injection, restart policy, and service dependencies", "tag": "General", "status": "Completed"},
                    {"id": "DEP-005", "task": "Test Docker Compose multi-service startup: verify all containers start, health checks pass, and inter-service communication works", "tag": "General", "status": "Completed"},
                ],
            },
            {
                "name": "CI/CD Pipeline",
                "tasks": [
                    {"id": "DEP-006", "task": "Configure GitHub Actions workflow (client-ci.yml): triggered on push to client/**, runs npm ci, ESLint, and Next.js build", "tag": "Frontend", "status": "Completed"},
                    {"id": "DEP-007", "task": "Configure GitHub Actions workflow (server-ci.yml): triggered on push to server/**, runs npm install and Jest test suite with test environment secrets", "tag": "Backend", "status": "Completed"},
                    {"id": "DEP-008", "task": "Verify CI pipeline passes for all feature branches and pull requests before merge to main/test branches", "tag": "General", "status": "Completed"},
                ],
            },
            {
                "name": "Environment Configuration",
                "tasks": [
                    {"id": "DEP-009", "task": "Configure production environment variables for Node.js server: MONGO_URI (Atlas connection string), JWT_SECRET, CORS_ORIGIN", "tag": "Backend", "status": "Completed"},
                    {"id": "DEP-010", "task": "Configure production environment variables for Python backend: LLM API keys (Vertex AI, Anthropic, OpenAI), vector DB credentials", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DEP-011", "task": "Configure Next.js production environment: NEXT_PUBLIC_API_URL pointing to deployed Node.js server", "tag": "Frontend", "status": "Completed"},
                    {"id": "DEP-012", "task": "Set up MongoDB Atlas cloud database, configure network access, and migrate schema/seed data", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Deployment Verification",
                "tasks": [
                    {"id": "DEP-013", "task": "Execute database migration scripts via Umzug on production MongoDB instance", "tag": "Backend", "status": "Completed"},
                    {"id": "DEP-014", "task": "Run vector index build script (build_index.py) on production server to populate ChromaDB with course embeddings", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DEP-015", "task": "Perform smoke testing on deployed system: verify health endpoints, user registration, login, course recommendation, and roadmap generation", "tag": "General", "status": "Completed"},
                    {"id": "DEP-016", "task": "Verify LLM API connectivity from production Python service to Vertex AI and Anthropic endpoints", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DEP-017", "task": "Document production deployment procedure and environment setup in project README.md", "tag": "General", "status": "Completed"},
                ],
            },
        ],
    },
    # ══════════════════════════════════════════════════════════════════════════
    {
        "phase": "PHASE 10: Documentation & Handover",
        "icon": "10",
        "color": "1F3864",
        "description": (
            "Produce complete technical documentation, developer guides, and handover "
            "materials ensuring the next team can understand and extend the system."
        ),
        "categories": [
            {
                "name": "Technical Documentation",
                "tasks": [
                    {"id": "DOC-001", "task": "Write DIAGRAM_API.md: complete REST API reference for roadmap generation endpoints with curl examples, request/response schemas, and error codes", "tag": "Backend", "status": "Completed"},
                    {"id": "DOC-002", "task": "Write MILESTONE_API.md: complete API reference for all 10 milestone endpoints with stage lifecycle documentation and progress calculation logic", "tag": "Backend", "status": "Completed"},
                    {"id": "DOC-003", "task": "Write DIAGRAM_IMPLEMENTATION.md: detailed implementation guide for roadmap orchestration, Python API integration, and data model design", "tag": "Backend", "status": "Completed"},
                    {"id": "DOC-004", "task": "Write AGENTIC_RAG_ARCHITECTURE.md: comprehensive documentation of 12-agent pipeline, RAG components, LLM routing, and design rationale", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DOC-005", "task": "Write MODEL_COMPARISON_REPORT.md: ML model evaluation results, algorithm selection rationale, accuracy metrics, and performance benchmarks", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DOC-006", "task": "Write comprehensive project README.md: project overview, team, technology stack, prerequisites, local setup guide, Docker deployment instructions", "tag": "General", "status": "Completed"},
                ],
            },
            {
                "name": "API & Schema Documentation",
                "tasks": [
                    {"id": "DOC-007", "task": "Leverage FastAPI auto-generated interactive docs (Swagger UI at /docs and ReDoc at /redoc) for Python backend API documentation", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DOC-008", "task": "Document all Pydantic request/response schemas with field descriptions and example payloads", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DOC-009", "task": "Document all Node.js validation rules per endpoint: required fields, enum values, min/max constraints in DIAGRAM_API.md and MILESTONE_API.md", "tag": "Backend", "status": "Completed"},
                ],
            },
            {
                "name": "Maintenance & Support Readiness",
                "tasks": [
                    {"id": "DOC-010", "task": "Implement structured logging across Python backend using logger.py utility for monitoring API calls, errors, and LLM response times", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DOC-011", "task": "Implement Morgan HTTP request logging on Node.js server for all incoming requests with method, route, status, and response time", "tag": "Backend", "status": "Completed"},
                    {"id": "DOC-012", "task": "Implement GET /debug/features and GET /debug/model-info endpoints for ML model introspection and troubleshooting", "tag": "AI/ML", "status": "Completed"},
                    {"id": "DOC-013", "task": "Create developer onboarding guide covering local development setup, environment variable configuration, and common debugging steps", "tag": "General", "status": "Completed"},
                    {"id": "DOC-014", "task": "Document Git branching strategy, PR workflow, and CI/CD pipeline for new team members", "tag": "General", "status": "Completed"},
                    {"id": "DOC-015", "task": "Produce comprehensive test case document covering all 87 test cases across 12 modules in standardised format (AspireAI_Test_Cases.docx)", "tag": "General", "status": "Completed"},
                ],
            },
        ],
    },
]

# ─────────────────────────────────────────────────────────────────────────────
# TAG COLOUR MAP
# ─────────────────────────────────────────────────────────────────────────────

TAG_COLORS = {
    "Frontend":              ("D6E4F0", "1A5276"),
    "Backend":               ("D5F5E3", "1E8449"),
    "AI/ML":                 ("FDEBD0", "CA6F1E"),
    "General":               ("E8DAEF", "7D3C98"),
    "Frontend / Backend":    ("D6EAF8", "1F618D"),
    "Backend / AI/ML":       ("EAFAF1", "1E8449"),
    "Frontend / AI/ML":      ("FEF9E7", "B7950B"),
    "Backend / Frontend":    ("EBF5FB", "2471A3"),
    "AI/ML / Frontend":      ("FDF2E9", "CA6F1E"),
}

PRIORITY_COLORS = {
    "Completed": ("D5F5E3", "1E8449"),
}


def set_cell_bg(cell, hex_color: str):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)


def set_cell_borders(cell, color="CCCCCC"):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        border = OxmlElement(f"w:{edge}")
        border.set(qn("w:val"), "single")
        border.set(qn("w:sz"), "4")
        border.set(qn("w:space"), "0")
        border.set(qn("w:color"), color)
        tcBorders.append(border)
    tcPr.append(tcBorders)


def add_phase_header(doc: Document, phase: dict):
    """Add a coloured full-width phase title bar."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.columns[0].width = Cm(17.5)
    cell = table.cell(0, 0)
    set_cell_bg(cell, phase["color"])
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = p.add_run(f"  {phase['phase']}")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    doc.add_paragraph()


def add_task_table(doc: Document, category: dict, start_idx: int):
    """Render a category block with a sub-heading and task rows."""
    # Category sub-heading
    cat_p = doc.add_paragraph()
    cat_r = cat_p.add_run(f"   ▸  {category['name']}")
    cat_r.bold = True
    cat_r.font.size = Pt(10.5)
    cat_r.font.color.rgb = RGBColor(0x1F, 0x38, 0x64)

    tasks = category["tasks"]

    # Table: No | ID | Task | Tag | Status
    col_widths = [Cm(0.9), Cm(1.6), Cm(10.8), Cm(2.8), Cm(1.8)]
    headers = ["No.", "Task ID", "Task Description", "Component", "Status"]

    table = doc.add_table(rows=1 + len(tasks), cols=5)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    for i, w in enumerate(col_widths):
        for row in table.rows:
            row.cells[i].width = w

    # Header row
    hrow = table.rows[0]
    for i, h in enumerate(headers):
        cell = hrow.cells[i]
        set_cell_bg(cell, "1F3864")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # Data rows
    for row_i, task in enumerate(tasks):
        drow = table.rows[row_i + 1]
        row_bg = "F7F9FB" if row_i % 2 == 0 else "FFFFFF"

        # No.
        c0 = drow.cells[0]
        set_cell_bg(c0, row_bg)
        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r0 = p0.add_run(str(start_idx + row_i))
        r0.font.size = Pt(8.5)
        c0.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

        # ID
        c1 = drow.cells[1]
        set_cell_bg(c1, row_bg)
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r1 = p1.add_run(task["id"])
        r1.bold = True
        r1.font.size = Pt(8.5)
        c1.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

        # Task Description
        c2 = drow.cells[2]
        set_cell_bg(c2, row_bg)
        p2 = c2.paragraphs[0]
        r2 = p2.add_run(task["task"])
        r2.font.size = Pt(8.5)
        c2.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

        # Tag (coloured badge-style)
        c3 = drow.cells[3]
        tag = task["tag"]
        tag_bg, tag_fg = TAG_COLORS.get(tag, ("EEEEEE", "333333"))
        set_cell_bg(c3, tag_bg)
        p3 = c3.paragraphs[0]
        p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r3 = p3.add_run(tag)
        r3.font.size = Pt(8)
        r3.bold = True
        rgb = tuple(int(tag_fg[i:i+2], 16) for i in (0, 2, 4))
        r3.font.color.rgb = RGBColor(*rgb)
        c3.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

        # Status
        c4 = drow.cells[4]
        st_bg, st_fg = PRIORITY_COLORS.get(task["status"], ("EEEEEE", "333333"))
        set_cell_bg(c4, st_bg)
        p4 = c4.paragraphs[0]
        p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r4 = p4.add_run(task["status"])
        r4.font.size = Pt(8)
        r4.bold = True
        rgb4 = tuple(int(st_fg[i:i+2], 16) for i in (0, 2, 4))
        r4.font.color.rgb = RGBColor(*rgb4)
        c4.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    doc.add_paragraph()


def build_document(output_path: str):
    doc = Document()

    # Page margins
    for section in doc.sections:
        section.top_margin    = Cm(2.0)
        section.bottom_margin = Cm(2.0)
        section.left_margin   = Cm(2.0)
        section.right_margin  = Cm(1.5)

    # ── Cover Page ────────────────────────────────────────────────────────────
    doc.add_paragraph()
    doc.add_paragraph()

    t = doc.add_paragraph()
    t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    tr = t.add_run("AspireAI")
    tr.bold = True
    tr.font.size = Pt(32)
    tr.font.color.rgb = RGBColor(0x1F, 0x38, 0x64)

    t2 = doc.add_paragraph()
    t2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    tr2 = t2.add_run("Project Task List — Complete SDLC Activity Register")
    tr2.bold = True
    tr2.font.size = Pt(16)
    tr2.font.color.rgb = RGBColor(0x2E, 0x86, 0xC1)

    doc.add_paragraph()

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub.add_run(
        "AI-Powered Career Guidance Platform for Sri Lankan Students\n"
        "Frontend  ·  Backend  ·  AI/ML  ·  Integration  ·  Deployment"
    ).font.size = Pt(12)

    doc.add_paragraph()
    doc.add_paragraph()

    meta = [
        ("Project",       "AspireAI Career Guidance Platform"),
        ("Document Type", "SDLC Project Task List"),
        ("Version",       "1.0"),
        ("Date",          datetime.date.today().strftime("%B %d, %Y")),
        ("Prepared By",   "Business Analysis Team"),
        ("Status",        "All Tasks Completed"),
    ]

    meta_table = doc.add_table(rows=len(meta), cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.style = "Table Grid"
    for i, (k, v) in enumerate(meta):
        r = meta_table.rows[i]
        kc = r.cells[0]
        vc = r.cells[1]
        set_cell_bg(kc, "1F3864")
        kc.width = Cm(4)
        vc.width = Cm(8)
        kp = kc.paragraphs[0]
        kp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        kr = kp.add_run(k)
        kr.bold = True
        kr.font.size = Pt(10)
        kr.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        vp = vc.paragraphs[0]
        vp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        vr = vp.add_run(v)
        vr.font.size = Pt(10)
        if k == "Status":
            vr.bold = True
            vr.font.color.rgb = RGBColor(0x1E, 0x84, 0x49)

    doc.add_page_break()

    # ── Legend ────────────────────────────────────────────────────────────────
    legend_h = doc.add_heading("Component Colour Legend", level=1)
    for r in legend_h.runs:
        r.font.color.rgb = RGBColor(0x1F, 0x38, 0x64)

    legend_items = [
        ("Frontend",           "D6E4F0", "1A5276", "Next.js pages, React components, UI/UX, state management"),
        ("Backend",            "D5F5E3", "1E8449", "Node.js/Express API, MongoDB models, authentication, middleware"),
        ("AI/ML",              "FDEBD0", "CA6F1E", "Python FastAPI, ML models, RAG pipeline, LLM agents"),
        ("General",            "E8DAEF", "7D3C98", "Architecture, DevOps, CI/CD, documentation, stakeholder activities"),
        ("Frontend / Backend", "D6EAF8", "1F618D", "Cross-cutting tasks spanning both frontend and Node.js backend"),
        ("Backend / AI/ML",    "EAFAF1", "1E8449", "Integration between Node.js server and Python AI service"),
        ("Frontend / AI/ML",   "FEF9E7", "B7950B", "Frontend components calling Python FastAPI directly"),
    ]

    leg_table = doc.add_table(rows=len(legend_items), cols=2)
    leg_table.style = "Table Grid"
    leg_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, (tag, bg, fg, desc) in enumerate(legend_items):
        tc = leg_table.rows[i].cells[0]
        dc = leg_table.rows[i].cells[1]
        tc.width = Cm(4)
        dc.width = Cm(13)
        set_cell_bg(tc, bg)
        tp = tc.paragraphs[0]
        tp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        tr_ = tp.add_run(tag)
        tr_.bold = True
        tr_.font.size = Pt(9)
        rgb = tuple(int(fg[i:i+2], 16) for i in (0, 2, 4))
        tr_.font.color.rgb = RGBColor(*rgb)
        dp = dc.paragraphs[0]
        dr = dp.add_run(desc)
        dr.font.size = Pt(9)

    doc.add_paragraph()

    # ── Summary Table ─────────────────────────────────────────────────────────
    sum_h = doc.add_heading("Phase Summary", level=1)
    for r in sum_h.runs:
        r.font.color.rgb = RGBColor(0x1F, 0x38, 0x64)

    total_tasks = sum(
        len(task_item)
        for phase in PHASES
        for cat in phase["categories"]
        for task_item in [cat["tasks"]]
    )

    sum_table = doc.add_table(rows=1 + len(PHASES) + 1, cols=4)
    sum_table.style = "Table Grid"
    sum_table.alignment = WD_TABLE_ALIGNMENT.CENTER

    sh = ["#", "Phase", "Categories", "Tasks"]
    for i, h in enumerate(sh):
        c = sum_table.rows[0].cells[i]
        set_cell_bg(c, "1F3864")
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    for pi, phase in enumerate(PHASES):
        n_cats  = len(phase["categories"])
        n_tasks = sum(len(c["tasks"]) for c in phase["categories"])
        row = sum_table.rows[pi + 1]
        bg = "F7F9FB" if pi % 2 == 0 else "FFFFFF"
        vals = [str(pi + 1), phase["phase"].replace("PHASE " + str(pi+1) + ": ", ""), str(n_cats), str(n_tasks)]
        aligns = [WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT,
                  WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER]
        for ci, (val, al) in enumerate(zip(vals, aligns)):
            cell = row.cells[ci]
            set_cell_bg(cell, bg)
            p = cell.paragraphs[0]
            p.alignment = al
            p.add_run(val).font.size = Pt(9)

    # Total row
    tot_row = sum_table.rows[-1]
    set_cell_bg(tot_row.cells[0], "2E4057")
    set_cell_bg(tot_row.cells[1], "2E4057")
    set_cell_bg(tot_row.cells[2], "2E4057")
    set_cell_bg(tot_row.cells[3], "2E4057")
    tot_row.cells[1].paragraphs[0].add_run("TOTAL").font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    tot_row.cells[1].paragraphs[0].runs[-1].bold = True
    tot_row.cells[1].paragraphs[0].runs[-1].font.size = Pt(9)
    tot_cells = sum(len(p["categories"]) for p in PHASES)
    for ci, val in enumerate(["", "", str(tot_cells), str(total_tasks)]):
        if ci == 0:
            continue
        p = tot_row.cells[ci].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(val)
        r.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    doc.add_page_break()

    # ── Phase Sections ────────────────────────────────────────────────────────
    global_task_no = 1

    for phase in PHASES:
        add_phase_header(doc, phase)

        # Phase description
        desc_p = doc.add_paragraph(phase["description"])
        desc_p.runs[0].font.size = Pt(9.5)
        desc_p.runs[0].font.italic = True
        doc.add_paragraph()

        for category in phase["categories"]:
            add_task_table(doc, category, global_task_no)
            global_task_no += len(category["tasks"])

        doc.add_page_break()

    doc.save(output_path)
    print(f"[OK] Document saved: {output_path}")
    print(f"     Phases: {len(PHASES)}")
    print(f"     Total tasks: {total_tasks}")


if __name__ == "__main__":
    import os
    output = os.path.join(os.path.dirname(os.path.abspath(__file__)), "AspireAI_Project_Task_List.docx")
    build_document(output)
