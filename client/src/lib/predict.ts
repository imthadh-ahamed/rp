// lib/predict.ts

// ─── Student Profile (shared by all endpoints) ────────────────────────────────

export interface StudentProfile {
  Year: number;
  Stream: string;
  Subject_1: string; Grade_1: string;
  Subject_2: string; Grade_2: string;
  Subject_3: string; Grade_3: string;
  Z_Score: number;
  Island_Rank: number;
  Gen_Test: number;
  District: string;
  "Sinhala/Tamil": string;
  English: string;
  Maths: string;
  Science: string;
  q1_science_tech: number;
  q2_healthcare: number;
  q3_design: number;
  q4_data: number;
  q5_business: number;
  q6_arts_culture: number;
  q7_nature_env: number;
  q8_hands_on: number;
  q9_innovation: number;
  q10_people_social: number;
  q11_urban_corporate: number;
  q12_flexible_path: number;
}

// ─── Shared summary returned by every endpoint ────────────────────────────────

export interface InputSummary {
  stream: string;
  z_score: number;
  island_rank: number;
  district: string;
}

// ─── Course Recommendation types (/predict/courses) ──────────────────────────

export interface CourseRecommendation {
  rank: number;
  course: string;
  score: number;             // model probability (0–1)
  university: string;        // primary university from course map
  uni_code: string;
  aptitude_required: string; // "Yes" | "No"
}

export interface CourseRecommendationResult {
  recommendations: CourseRecommendation[];
  input_summary: InputSummary;
}

// ─── University Prediction types (/predict/batch) ────────────────────────────

export interface UniversityPrediction {
  university: string;
  probability: number; // percentage e.g. 34.52
}

export interface CoursePredictionResult {
  course: string;
  top_predictions: UniversityPrediction[] | null;
  error: string | null;
}

export interface MultiCoursePredictionResult {
  predictions: CoursePredictionResult[];
  input_summary: InputSummary;
}

// ─── Combined Prediction types (/predict/combined) ───────────────────────────

export interface CourseWithUniversities {
  rank: number;
  course: string;
  course_score: number;       // course model probability (0–1)
  university: string;         // primary university from course map
  uni_code: string;
  aptitude_required: string;
  top_university_predictions: UniversityPrediction[]; // admission probabilities
}

export interface CombinedPredictionResult {
  results: CourseWithUniversities[];
  input_summary: InputSummary;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface CombinedPredictionInput extends StudentProfile {
  /** How many top courses to recommend (default: 5, max: 20) */
  top_n_courses?: number;
}

// For manual multi-course (user picks specific courses)
export interface MultiCoursePredictionInput extends StudentProfile {
  courses: string[];
}

// Internal batch item shape the API expects
type BatchRequestItem = StudentProfile & { Course: string };

// ─── API base ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function parseApiError(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e: { loc?: string[]; msg?: string }) =>
        `${(e.loc ?? []).slice(1).join(" → ")}: ${e.msg ?? "invalid"}`
      )
      .join(" | ");
  }
  return "Prediction failed";
}

async function apiFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(parseApiError(err.detail));
  }
  return res.json() as Promise<T>;
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * PRIMARY: Combined endpoint — course model picks best-fit courses,
 * university model ranks admission chances for each. One round-trip.
 */
export async function getCombinedPredictions(
  input: CombinedPredictionInput
): Promise<CombinedPredictionResult> {
  return apiFetch<CombinedPredictionResult>("/predict/combined", input);
}

/**
 * Course recommendations only (no university probabilities).
 * Useful if you only need the course ranking step.
 */
export async function getCourseRecommendations(
  profile: StudentProfile,
  topN = 10
): Promise<CourseRecommendationResult> {
  return apiFetch<CourseRecommendationResult>(
    `/predict/courses?top_n=${topN}`,
    profile
  );
}

/**
 * University predictions for a manually selected list of courses.
 * Uses /predict/batch under the hood.
 */
export async function getMultiCoursePredictions(
  input: MultiCoursePredictionInput
): Promise<MultiCoursePredictionResult> {
  const { courses, ...profile } = input;
  if (!courses.length) throw new Error("Provide at least one course.");

  const payload: BatchRequestItem[] = courses.map((course) => ({
    ...profile,
    Course: course,
  }));

  const raw = await apiFetch<{ predictions: CoursePredictionResult[] }>(
    "/predict/batch",
    payload
  );

  return {
    predictions: raw.predictions,
    input_summary: {
      stream: profile.Stream,
      z_score: profile.Z_Score,
      island_rank: profile.Island_Rank,
      district: profile.District,
    },
  };
}

/** Health check */
export async function checkApiHealth(): Promise<boolean> {
  try {
    return (await fetch(`${API_BASE}/health`)).ok;
  } catch {
    return false;
  }
}