// lib/predict.ts

// ─── Base Profile (no Course — shared across all course predictions) ──────────

export interface StudentProfile {
  Year: number;

  // A/L stream & subjects
  Stream: string;
  Subject_1: string; Grade_1: string;
  Subject_2: string; Grade_2: string;
  Subject_3: string; Grade_3: string;

  // Scores
  Z_Score: number;
  Island_Rank: number;
  Gen_Test: number;

  // Location
  District: string;

  // O/L results (e.g. "A", "B", "C", "S", "W")
  "Sinhala/Tamil": string;
  English: string;
  Maths: string;
  Science: string;

  // Interest questionnaire (1–5)
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

// ─── Multi-Course Input ───────────────────────────────────────────────────────

export interface MultiCoursePredictionInput extends StudentProfile {
  /** One or more courses to predict university placements for */
  courses: string[];
}

// ─── Internal shape the FastAPI /predict/batch endpoint expects ───────────────

type BatchRequestItem = StudentProfile & { Course: string };

// ─── Response Types ───────────────────────────────────────────────────────────

export interface UniversityPrediction {
  university: string;
  probability: number; // percentage e.g. 34.52
}

export interface CoursePredictionResult {
  course: string;
  top_predictions: UniversityPrediction[] | null; // top 5, sorted desc
  error: string | null;
}

export interface MultiCoursePredictionResult {
  predictions: CoursePredictionResult[];
  input_summary: {
    stream: string;
    z_score: number;
    island_rank: number;
    district: string;
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

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

/**
 * Predict university admission chances across multiple courses in one call.
 *
 * Expands `courses[]` into a batch request → single API round-trip →
 * returns per-course university rankings plus a shared input_summary.
 */
export async function getMultiCoursePredictions(
  input: MultiCoursePredictionInput
): Promise<MultiCoursePredictionResult> {
  const { courses, ...profile } = input;

  if (!courses.length) {
    throw new Error("Provide at least one course.");
  }

  const batchPayload: BatchRequestItem[] = courses.map((course) => ({
    ...profile,
    Course: course,
  }));

  const res = await fetch(`${API_BASE}/predict/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(batchPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(parseApiError(err.detail));
  }

  const raw: { predictions: CoursePredictionResult[] } = await res.json();

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

/** Health check — true if the API is reachable. */
export async function checkApiHealth(): Promise<boolean> {
  try {
    return (await fetch(`${API_BASE}/health`)).ok;
  } catch {
    return false;
  }
}