# 📋 AspireAI Agentic RAG Architecture - Technical Report

## Executive Summary

AspireAI implements a sophisticated **Agentic RAG (Retrieval-Augmented Generation)** architecture for personalized course recommendations. The system combines semantic search, rule-based filtering, intelligent scoring, and LLM-powered explanations through a multi-agent pipeline. This report provides a comprehensive analysis of the end-to-end workflow, API handling, and validation mechanisms.

---

## 1. Agentic RAG Architecture Overview

### 1.1 System Components

The Agentic RAG system consists of **six specialized agents** orchestrated through a central pipeline:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AGENTIC RAG PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│   │  Validation  │───▶│  RAG Search  │───▶│ Eligibility  │                │
│   │    Layer     │    │    Agent     │    │    Agent     │                │
│   └──────────────┘    └──────────────┘    └──────────────┘                │
│         │                    │                    │                        │
│         ▼                    ▼                    ▼                        │
│   Pre-flight checks    Semantic Vector     A/L + IELTS + O/L              │
│   Age, Location        Search (Nomic)      HARD GATE                      │
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│   │  Filtering   │───▶│   Ranking    │───▶│ Explanation  │                │
│   │    Agent     │    │    Agent     │    │    Agent     │                │
│   └──────────────┘    └──────────────┘    └──────────────┘                │
│         │                    │                    │                        │
│         ▼                    ▼                    ▼                        │
│   Career Domain        Hybrid Scoring      LLM-Powered                    │
│   Location/Method      Distance + Bonus    Natural Language               │
│   Duration             Career Penalty                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Agent Responsibilities

| Agent | File | Responsibility | Type |
|-------|------|----------------|------|
| **Validation Layer** | `backend/core/validators/validation_layer.py` | Pre-flight profile validation | Rule-Based |
| **RAG Search Agent** | `backend/core/rag/retriever.py` | Semantic course retrieval | Vector Search |
| **Eligibility Agent** | `backend/core/agents/eligibility_agent.py` | Academic requirement enforcement | Rule-Based (HARD) |
| **Filtering Agent** | `backend/core/agents/filtering_agent.py` | Preference matching | Rule-Based (SOFT) |
| **Ranking Agent** | `backend/core/agents/ranking_agent.py` | Score computation & sorting | Hybrid ML |
| **Explanation Agent** | `backend/core/agents/explanation_agent.py` | Natural language generation | LLM-Powered |

---

## 2. Complete Agentic RAG Flow

### 2.1 Pipeline Execution Flow

```
User Profile Input
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ STEP 0: VALIDATION LAYER                                      │
│ ─────────────────────────────────────────────────────────────│
│ • Age validation (minimum 12+, warnings for <18)              │
│ • Location availability check                                  │
│ • A/L requirement warning (if age ≥18 and no A/L)             │
│ • Duration feasibility check                                   │
│                                                                │
│ IF errors → RETURN {status: "error", errors: [...]}           │
│ ELSE → Continue with warnings                                  │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ STEP 1: RAG SEMANTIC SEARCH                                   │
│ ─────────────────────────────────────────────────────────────│
│ Input: User profile → Natural language query                   │
│                                                                │
│ Process:                                                       │
│ 1. build_user_profile() → Convert to rich text description    │
│ 2. embed_text() → 768-dim Nomic vector embedding              │
│ 3. ChromaDB.query() → Retrieve top-k similar courses          │
│                                                                │
│ Output: 25 candidate courses with distance scores              │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ STEP 2: ELIGIBILITY AGENT (HARD GATE) 🛑                      │
│ ─────────────────────────────────────────────────────────────│
│ CRITICAL: This is a BLOCKING filter - not a soft score        │
│                                                                │
│ Checks:                                                        │
│ ├── A/L Requirement Check                                      │
│ │   • has_al_eligibility(user) → Check if A/L provided        │
│ │   • course_requires_al(course) → Check if course needs A/L  │
│ │   • IF course requires A/L AND user has no A/L → BLOCK      │
│ │                                                              │
│ ├── IELTS Requirement Check                                    │
│ │   • Extract required score from "Entry Requirements"         │
│ │   • Compare with user's IELTS score                         │
│ │   • IF user_score < required_score → BLOCK                  │
│ │                                                              │
│ └── O/L Requirement Check                                      │
│     • Verify O/L results if course requires them               │
│                                                                │
│ IF all candidates blocked → RETURN {status: "blocked"}        │
│ ELSE → Pass eligible courses to next stage                     │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ STEP 3: FILTERING AGENT (SOFT CONSTRAINTS)                    │
│ ─────────────────────────────────────────────────────────────│
│ Filters (with lenient fallback):                               │
│                                                                │
│ 1. Career Domain Filter (HARD within this stage)               │
│    • matches_career_domain(career_goal, course_text)           │
│    • Uses CAREER_DOMAIN_MAP for keyword matching               │
│                                                                │
│ 2. Location Filter                                             │
│    • matches_location(user_pref, course_location)              │
│    • Handles multi-location strings ("Colombo/Kandy")          │
│                                                                │
│ 3. Study Method Filter                                         │
│    • matches_study_method(user_pref, course_method)            │
│    • Handles synonyms: "onsite" = "full time"                  │
│                                                                │
│ 4. Duration Filter                                             │
│    • matches_duration(user_period, course_duration)            │
│                                                                │
│ FALLBACK: If too strict → Return career-filtered only          │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ STEP 4: RANKING AGENT                                         │
│ ─────────────────────────────────────────────────────────────│
│ Score Formula (0-100):                                         │
│                                                                │
│ Base Score = (1 - distance) × 70     [RAG similarity]         │
│                                                                │
│ Bonuses:                                                       │
│ ├── Interest Area Match    → +10 pts                          │
│ ├── Career Goal Alignment  → +10 pts                          │
│ ├── Study Method Match     → +5 pts                           │
│ └── Location Match         → +5 pts                           │
│                                                                │
│ Penalties:                                                     │
│ └── Career Domain Mismatch → -30 pts                          │
│                                                                │
│ Final Score = clamp(Base + Bonuses - Penalties, 0, 100)       │
│                                                                │
│ Output: Sorted list (highest score first)                      │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ STEP 5: EXPLANATION AGENT                                     │
│ ─────────────────────────────────────────────────────────────│
│ For each course:                                               │
│                                                                │
│ 1. Check career alignment:                                     │
│    • matches_career_domain(career_goal, course_text)           │
│                                                                │
│ 2. Generate explanation:                                       │
│    IF career_aligned:                                          │
│      → "This {course} is well-suited for students pursuing     │
│         careers in {career_goal}..."                           │
│    ELSE:                                                       │
│      → "While not directly aligned with {career_goal},         │
│         it provides transferable skills..."                    │
│                                                                │
│ 3. Attach explanation to recommendation                        │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
   FINAL OUTPUT
   {status, results, warnings}
```

### 2.2 RAG Retrieval Deep Dive

The RAG component uses **Nomic-Embed-Text-v1.5** for semantic embeddings:

```python
# User Profile → Natural Language Query
def build_user_profile(user):
    profile = f"""
    Provide course recommendations for a student with the following profile:
    - Age: {user.get('age', 'N/A')}
    - A/L Stream: {user.get('al_stream', 'N/A')}
    - A/L Results: {user.get('al_results', 'N/A')}
    - Career Goal: {user.get('career_goal', 'N/A')}
    - Preferred Study Locations: {user.get('preferred_locations', 'N/A')}
    ...
    The goal is to find the most academically suitable, financially suitable, 
    and career-aligned degree courses.
    """
    return profile
```

**Embedding Process:**
1. Convert user profile to rich natural language text
2. Generate 768-dimensional normalized vector using Nomic model
3. Query ChromaDB with cosine similarity
4. Return top-k courses with distance scores

---

## 3. `/recommend` API Workflow

### 3.1 Request Flow Diagram

```
HTTP POST /api/recommend
        │
        ▼
┌─────────────────────────────────────────────┐
│ FastAPI Router (recommend.py)               │
│ ─────────────────────────────────────────── │
│ 1. Receive UserProfile (Pydantic model)     │
│ 2. profile.model_dump(exclude_none=True)    │
│ 3. Call orchestrator.recommend_courses()    │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ Orchestrator Pipeline                        │
│ ─────────────────────────────────────────── │
│ Parameters:                                  │
│ • initial_k=25 (RAG candidates)             │
│ • final_k=10 (returned results)             │
│ • explain_top_n=5 (LLM explanations)        │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ Response Mapping                             │
│ ─────────────────────────────────────────── │
│ For each result:                             │
│ • Generate UUID                              │
│ • Extract: course_name, university, location │
│ • Extract from document text:                │
│   - Career Opportunities                     │
│   - Study Language, Method                   │
│   - Requirements, Fees                       │
│ • Map to RecommendationResult schema         │
└─────────────────────────────────────────────┘
        │
        ▼
HTTP Response: RecommendationResponse
{
  "status": "success",
  "recommendations": [...],
  "warnings": [...],
  "errors": []
}
```

### 3.2 Step-by-Step Code Flow

**Step 1: API Entry Point** (`backend/api/routes/recommend.py`)
```python
@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(profile: UserProfile):
    # Convert Pydantic model to dictionary
    user_data = profile.model_dump(exclude_none=True)
    
    # Call orchestrator with default parameters
    response = await recommend_courses(
        user_data, 
        initial_k=25,    # Retrieve 25 candidates from RAG
        final_k=10,      # Return top 10 recommendations
        explain_top_n=5  # Generate explanations for top 5
    )
```

**Step 2: Orchestrator Execution** (`backend/core/agents/orchestrator.py`)
```python
async def recommend_courses(user_input, initial_k=25, final_k=10, explain_top_n=5):
    # Step 0: Validation
    validation = validate_user_profile(user_input, AVAILABLE_LOCATIONS)
    if validation["status"] == "error":
        return {"status": "error", "errors": validation["errors"]}
    
    # Step 1: RAG Retrieval
    rag_results = rag_search(user_input, top_k=initial_k)
    
    # Step 2: Eligibility Filter (HARD GATE)
    eligible = filter_by_eligibility(user_input, rag_results)
    
    # Step 3: Preference Filter
    filtered = filter_candidates(user_input, eligible)
    
    # Step 4: Ranking
    ranked = rank_candidates(user_input, filtered)
    
    # Step 5: Explanations
    final_results = await add_explanations(user_input, ranked, top_n=explain_top_n)
    
    return {"status": "success", "results": final_results, "warnings": warnings}
```

**Step 3: Response Mapping**
```python
# Extract fields from course document text
def extract_field(label):
    # Case-insensitive search in document text
    # Returns field value or "N/A"

mapped_recommendations.append(RecommendationResult(
    id=str(uuid.uuid4()),
    rank=index,
    course_name=item.get("course", "Unknown"),
    university=meta.get("campus", "Unknown"),
    match_score=item.get("score", 0.0),
    explanation=item.get("explanation", "No explanation provided."),
    # ... additional fields
))
```

---

## 4. Validation Mechanisms

### 4.1 Multi-Layer Validation Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VALIDATION LAYERS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ LAYER 1: API Schema Validation (Pydantic)                                   │
│ ─────────────────────────────────────────────                               │
│ • Type checking (str, int, Optional)                                        │
│ • Field constraints (Field annotations)                                     │
│ • Automatic JSON deserialization                                            │
│                                                                             │
│ LAYER 2: Pre-Pipeline Validation (validation_layer.py)                      │
│ ─────────────────────────────────────────────────────                       │
│ • Business logic validation                                                 │
│ • Age requirements                                                          │
│ • Location availability                                                     │
│ • A/L requirement warnings                                                  │
│                                                                             │
│ LAYER 3: Eligibility Validation (eligibility_agent.py)                      │
│ ─────────────────────────────────────────────────────                       │
│ • A/L requirement enforcement (HARD GATE)                                   │
│ • IELTS score validation                                                    │
│ • O/L requirement check                                                     │
│                                                                             │
│ LAYER 4: Career Domain Validation (career_intent.py)                        │
│ ─────────────────────────────────────────────────────                       │
│ • Career-to-domain mapping                                                  │
│ • Domain penalty calculation                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Layer 1: Pydantic Schema Validation

**File:** `backend/api/schemas/recommendation.py`

```python
class UserProfile(BaseModel):
    age: Optional[str] = Field(None, description="Age of the student")
    al_stream: Optional[str] = Field(None, description="A/L Stream")
    al_results: Optional[str] = Field(None, description="A/L Results summary")
    career_goal: Optional[str] = Field(None, description="Career goal")
    # ... 16 total fields
```

**Validation Behavior:**
- Automatic type coercion
- Optional fields accept `None`
- Invalid JSON → HTTP 422 Unprocessable Entity

### 4.3 Layer 2: Pre-Pipeline Business Validation

**File:** `backend/core/validators/validation_layer.py`

| Check | Condition | Result |
|-------|-----------|--------|
| **Age Minimum** | age < 12 | ERROR: "minimum age is 12+" |
| **Age Warning** | age < 15 | ERROR: "too young for degrees" |
| **Age Advisory** | age < 18 | WARNING: "most degrees require A/Ls" |
| **A/L Advisory** | no A/L && age ≥ 18 | WARNING: "A/L may be required" |
| **Location Check** | location not in DB | ERROR: "no programs available" |
| **Duration Check** | period = "1 year" | WARNING: "degrees take 3-4 years" |

```python
def validate_user_profile(user, available_locations):
    errors = []
    warnings = []
    
    # Age validation
    if age < 12:
        errors.append("minimum age for any academic program is 12+")
    elif age < 15:
        errors.append("too young for degree programs")
    elif age < 18:
        warnings.append("most degrees require completed A/Ls")
    
    # Location validation
    if preferred_location not in normalized_available:
        errors.append(f"No programs available in {preferred_location}")
    
    if errors:
        return {"status": "error", "errors": errors, "warnings": warnings}
    return {"status": "ok", "warnings": warnings}
```

### 4.4 Layer 3: Eligibility Gate Validation

**File:** `backend/core/agents/eligibility_agent.py`

This is the **CRITICAL HARD GATE** that ensures academically valid recommendations:

```python
def has_al_eligibility(user):
    """Check if user has A/L qualification"""
    al_results = user.get("al_results") or ""
    al_stream = user.get("al_stream") or ""
    
    has_results = bool(al_results.strip() and al_results.lower() != "null")
    has_stream = bool(al_stream.strip() and al_stream.lower() != "null")
    
    return has_results or has_stream

def course_requires_al(course_meta):
    """Check if course requires A/L"""
    text = " ".join([...]).lower()
    
    # A/L indicators
    al_keywords = ["a/l", "advanced level", "physical science", 
                   "combined mathematics", "physics", "chemistry"]
    
    # Exemption indicators
    exemption_keywords = ["foundation", "diploma", "o/l only"]
    
    requires_al = any(kw in text for kw in al_keywords)
    has_exemption = any(kw in text for kw in exemption_keywords)
    
    # Degrees require A/L unless explicitly exempted
    is_degree = any(w in text for w in ["bachelor", "bsc", "beng"])
    
    return (is_degree and not has_exemption) or (requires_al and not has_exemption)

def is_eligible_for_course(user, course_meta):
    """Master eligibility check"""
    # A/L Check (HARD GATE)
    if course_requires_al(course_meta) and not has_al_eligibility(user):
        return False  # BLOCKED
    
    # IELTS Check
    if "ielts" in entry_req:
        if user_score < required_score:
            return False
    
    return True
```

**A/L Gate Logic Flow:**
```
Is course a degree program?
        │
        ├── YES ──▶ Does it have exemption keywords?
        │              │
        │              ├── YES ──▶ Allow (Foundation/Diploma)
        │              │
        │              └── NO ──▶ Does user have A/L?
        │                            │
        │                            ├── YES ──▶ Allow
        │                            │
        │                            └── NO ──▶ BLOCK ❌
        │
        └── NO ──▶ Check other requirements
```

### 4.5 Layer 4: Career Domain Validation

**File:** `backend/core/agents/career_intent.py`

```python
CAREER_DOMAIN_MAP = {
    "civil engineer": ["civil", "construction", "structural", "infrastructure"],
    "software engineer": ["software", "computer science", "computing", "programming"],
    "data scientist": ["data science", "machine learning", "artificial intelligence"],
    # ... 14 career mappings
}

def matches_career_domain(career_goal, course_text):
    """Check if course matches career domain"""
    allowed_domains = infer_allowed_domains(career_goal)
    
    if not allowed_domains:
        return True  # Permissive fallback
    
    return any(domain in course_text.lower() for domain in allowed_domains)

def get_domain_penalty(user, course_meta):
    """Calculate ranking penalty for domain mismatch"""
    if matches_career_domain(career_goal, course_text):
        return 0.0   # No penalty
    else:
        return 30.0  # Heavy penalty (-30 points from score)
```

---

## 5. Output Verification & Quality Assurance

### 5.1 Pipeline Logging

The orchestrator provides comprehensive logging at each stage:

```
================================================================================
🎯 AGENTIC COURSE RECOMMENDATION PIPELINE
================================================================================

🛡️ Step 0: Validating user profile...
✅ Validation passed

📚 Step 1: Retrieving top 25 candidates using semantic search...
   Retrieved 25 candidates

✅ Step 2: Filtering by eligibility requirements...
🛑 A/L Eligibility Gate: Blocked 18 courses (A/L required but not provided)
   Examples: BSc Civil Engineering, BEng Mechanical Engineering, BSc Computer Science
   7 candidates passed eligibility check

🔍 Step 3: Filtering by user preferences (location, study method, duration)...
   5 candidates match user preferences

⭐ Step 4: Ranking candidates by combined score...
   Ranked 5 candidates

💡 Step 5: Generating AI-powered explanations for top 5 courses...
================================================================================
✅ RECOMMENDATION PIPELINE COMPLETE
================================================================================
```

### 5.2 Error Response Structures

**Validation Error:**
```json
{
  "status": "error",
  "errors": ["minimum age for any academic program is 12+"],
  "warnings": []
}
```

**Eligibility Blocked:**
```json
{
  "status": "blocked",
  "reason": "Academic eligibility not met",
  "message": "All recommended programs require completed G.C.E. A/L results.",
  "suggestions": [
    "Complete G.C.E. A/L",
    "Consider Foundation or Diploma programs"
  ],
  "recommendations": []
}
```

**Success Response:**
```json
{
  "status": "success",
  "recommendations": [
    {
      "id": "uuid",
      "rank": 1,
      "course_name": "BSc Civil Engineering",
      "university": "University of Moratuwa",
      "match_score": 87.5,
      "explanation": "This course is well-suited for..."
    }
  ],
  "warnings": []
}
```

---

## 6. Technical Implementation Details

### 6.1 Vector Embedding Stack

**Model:** Nomic-Embed-Text-v1.5
- **Dimensions:** 768
- **Framework:** SentenceTransformers
- **Normalization:** L2 normalized vectors
- **Similarity:** Cosine similarity

**ChromaDB Configuration:**
- **Storage:** Persistent local storage (`backend/data/embeddings`)
- **Collection:** "courses"
- **Indexing:** Automatic HNSW indexing

### 6.2 LLM Integration

**Primary Provider:** DeepSeek-V3
- **Purpose:** Explanation generation
- **Timeout:** 30 seconds per request
- **Fallback:** Template-based explanations

**Alternative Providers:**
- OpenAI GPT-4/GPT-3.5
- Anthropic Claude Sonnet 4.5
- Google Vertex AI (Gemini)

### 6.3 Scoring Algorithm Details

```python
def compute_score(user, candidate):
    distance = candidate["distance"]
    similarity = 1.0 - distance
    
    # Base score from RAG similarity (0-70 points)
    score = similarity * 70
    
    # Interest area match (+10 points)
    if user_interest_keyword in course_text:
        score += 10
    
    # Career goal alignment (+10 points)
    if career_keyword in course_opportunities:
        score += 10
    
    # Study method preference (+5 points)
    if user_method matches course_method:
        score += 5
    
    # Location preference (+5 points)
    if user_location in course_location:
        score += 5
    
    # Career domain penalty (-30 points)
    if not matches_career_domain(user_career, course):
        score -= 30
    
    return clamp(score, 0, 100)
```

---

## 7. Performance Characteristics

### 7.1 Response Times

| Stage | Average Time | Notes |
|-------|-------------|-------|
| Validation | <5ms | Rule-based checks |
| RAG Search | 50-100ms | Vector similarity search |
| Eligibility Filter | <10ms | Text pattern matching |
| Preference Filter | <5ms | Simple comparisons |
| Ranking | <20ms | Score computation |
| Explanations (LLM) | 2-5s | Network latency dependent |
| **Total Pipeline** | **2.5-5.5s** | Dominated by LLM calls |

### 7.2 Scalability Considerations

**Current Limitations:**
- Single ChromaDB instance (local storage)
- Synchronous LLM calls
- No caching layer

**Recommended Improvements:**
- Migrate to cloud vector DB (Pinecone/Qdrant Cloud)
- Implement Redis caching for common queries
- Batch LLM explanation generation
- Add CDN for static course data

---

## 8. Summary

### 8.1 Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Multi-Agent Pipeline** | Separation of concerns, independent testing, easy maintenance |
| **A/L as HARD GATE** | Academic integrity - never recommend degrees to ineligible users |
| **Hybrid Scoring** | Combines semantic similarity with rule-based bonuses/penalties |
| **Career Domain Mapping** | Ensures recommendations align with career goals |
| **Graceful Fallbacks** | Returns useful results even when strict filters remove all candidates |
| **Nomic Embeddings** | Open-source, high-quality, locally deployable |

### 8.2 Validation Summary

| Layer | Location | Type | Behavior |
|-------|----------|------|----------|
| Schema | Pydantic | Type Safety | HTTP 422 on invalid |
| Business | validation_layer.py | Rules | Errors/Warnings |
| Eligibility | eligibility_agent.py | HARD GATE | BLOCK ineligible |
| Domain | career_intent.py | Soft Penalty | -30 score penalty |

### 8.3 Data Flow Summary

```
User Profile → Pydantic Validation → Business Validation → RAG Search (25)
     → Eligibility Filter → Preference Filter → Ranking → Explanations
     → Response Mapping → JSON Response
```

### 8.4 Success Criteria

The system is considered successful when:
1. ✅ No academically ineligible courses are recommended
2. ✅ Top recommendations align with user's career goals
3. ✅ Explanations are clear and accurate
4. ✅ Response time < 6 seconds (90th percentile)
5. ✅ User satisfaction rate > 80%

---

## 9. Future Enhancements

### 9.1 Planned Improvements

1. **ML Model Integration**
   - Add KNN/Random Forest/XGBoost models for hybrid scoring
   - Train on historical user selection data
   - A/B test ML vs rule-based ranking

2. **Advanced RAG Techniques**
   - Implement query expansion
   - Add re-ranking stage with cross-encoder
   - Multi-vector retrieval (course + reviews + outcomes)

3. **Personalization Engine**
   - User profile embeddings
   - Collaborative filtering
   - Session-based recommendations

4. **Explanation Enhancement**
   - Add career trajectory visualizations
   - Include alumni success stories
   - Provide skill gap analysis

5. **Monitoring & Analytics**
   - Track recommendation acceptance rates
   - Monitor pipeline stage performance
   - A/B testing framework

---

## 10. References

### 10.1 Key Files

| Component | File Path |
|-----------|-----------|
| API Entry | `backend/api/routes/recommend.py` |
| Orchestrator | `backend/core/agents/orchestrator.py` |
| RAG Retriever | `backend/core/rag/retriever.py` |
| Embedder | `backend/core/rag/nomic_embedder.py` |
| Eligibility | `backend/core/agents/eligibility_agent.py` |
| Filtering | `backend/core/agents/filtering_agent.py` |
| Ranking | `backend/core/agents/ranking_agent.py` |
| Explanations | `backend/core/agents/explanation_agent.py` |
| Validation | `backend/core/validators/validation_layer.py` |
| Career Intent | `backend/core/agents/career_intent.py` |
| Schemas | `backend/api/schemas/recommendation.py` |

### 10.2 External Resources

- [Nomic-Embed Documentation](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

---

**Document Version:** 1.0  
**Last Updated:** January 4, 2026  
**Maintained By:** AspireAI Development Team

This Agentic RAG architecture ensures **academically valid, career-aligned, and personalized** course recommendations through a robust multi-layer validation system and intelligent agent orchestration.
