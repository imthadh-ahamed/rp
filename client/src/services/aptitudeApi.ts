/**
 * Aptitude AI Quiz — API service client
 * Communicates with FastAPI on port 8000
 *
 * Question types:
 *   structured      — full MCQ, 4 options, one correct answer
 *   mini_structured — shorter question with 2–4 options
 *   essay           — open-ended written response
 *
 * Session tracking: each generate call returns a session_id. Pass it back on
 * subsequent calls so the backend knows which questions to avoid repeating.
 */

const QUIZ_BASE = process.env.NEXT_PUBLIC_QUIZ_API_URL ?? "http://localhost:8000/aptitude-ai";

// ── Types ──────────────────────────────────────────────────────────────────────

export type QuestionType = "structured" | "mini_structured" | "essay";

export interface StructuredQuestion {
  question: string;
  correct_answer: string;
  options: string[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  type: "structured";
}

export interface MiniStructuredQuestion {
  question: string;
  correct_answer: string;
  options: string[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  type: "mini_structured";
}

export interface EssayQuestion {
  question: string;
  word_limit: number;
  key_points: string[];
  model_answer: string;
  marking_criteria: string;
  difficulty: "medium" | "hard";
  type: "essay";
}

export type AnyQuestion = StructuredQuestion | MiniStructuredQuestion | EssayQuestion;

export interface HealthResponse {
  status: string;
  mode: "rag" | "direct";
  vector_store_ready: boolean;
  groq_api_configured: boolean;
}

/** Unified response from /generate */
export interface GenerateResponse {
  session_id: string;
  question_type: QuestionType;
  questions: AnyQuestion[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function quizFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${QUIZ_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail?.detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── API functions ─────────────────────────────────────────────────────────────

export async function getHealth(): Promise<HealthResponse> {
  return quizFetch<HealthResponse>("/health");
}

/**
 * Generate questions of any type from LLM + RAG + duplicate-check pipeline.
 * Pass `sessionId` from a previous call to ensure no repeat questions.
 */
export async function generateQuestions(
  questionType: QuestionType,
  numQuestions: number = 5,
  sessionId?: string
): Promise<GenerateResponse> {
  return quizFetch<GenerateResponse>("/generate", {
    method: "POST",
    body: JSON.stringify({
      question_type: questionType,
      num_questions: numQuestions,
      ...(sessionId ? { session_id: sessionId } : {}),
    }),
  });
}
