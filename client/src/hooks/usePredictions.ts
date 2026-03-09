// hooks/usePredictions.ts
import { useState, useCallback } from "react";
import {
  getCombinedPredictions,
  getCourseRecommendations,
  getMultiCoursePredictions,
  getRuleBasedRecommendations,
  checkApiHealth,
  type CombinedPredictionInput,
  type CombinedPredictionResult,
  type CourseWithUniversities,
  type StudentProfile,
  type CourseRecommendationResult,
  type MultiCoursePredictionInput,
  type MultiCoursePredictionResult,
} from "@/lib/predict";

// ─── Combined Hook (primary — course model + university model) ────────────────
//
// Usage:
//   const { predict, result, loading, error } = useCombinedPrediction();
//   await predict({ ...studentProfile, top_n_courses: 5 });
//
// result.results[i] contains:
//   - course name, course_score, university, uni_code, aptitude_required
//   - top_university_predictions: [{ university, probability }]

export function useCombinedPrediction() {
  const [result, setResult] = useState<CombinedPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(
    async (input: CombinedPredictionInput): Promise<CombinedPredictionResult | null> => {
      setLoading(true);
      setError(null);
      setResult(null);

      if (process.env.NODE_ENV === "development") {
        console.log("[useCombinedPrediction] payload:", JSON.stringify(input, null, 2));
      }

      try {
        const data = await getCombinedPredictions(input);
        if (process.env.NODE_ENV === "development") {
          console.log("[useCombinedPrediction] result:", data);
        }
        setResult(data);
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        if (process.env.NODE_ENV === "development") {
          console.error("[useCombinedPrediction] error:", message);
        }
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  // ── Derived helpers ──────────────────────────────────────────────────────

  /** All results that have at least one university prediction */
  const resultsWithUniversities: CourseWithUniversities[] =
    result?.results.filter((r) => r.top_university_predictions.length > 0) ?? [];

  /** Results where university prediction was empty (course model worked, uni model didn't) */
  const resultsWithoutUniversities: CourseWithUniversities[] =
    result?.results.filter((r) => r.top_university_predictions.length === 0) ?? [];

  /** The single top recommended course */
  const topCourse: CourseWithUniversities | null = result?.results[0] ?? null;

  return {
    predict,
    reset,
    result,
    loading,
    error,
    resultsWithUniversities,
    resultsWithoutUniversities,
    topCourse,
  };
}

// ─── Course-only Hook ─────────────────────────────────────────────────────────
//
// Use when you only need course recommendations without university probabilities.

export function useCourseRecommendations() {
  const [result, setResult] = useState<CourseRecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommend = useCallback(
    async (profile: StudentProfile, topN = 10): Promise<CourseRecommendationResult | null> => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await getCourseRecommendations(profile, topN);
        setResult(data);
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { recommend, result, loading, error, reset };
}

// ─── Manual Multi-Course Hook ─────────────────────────────────────────────────
//
// Use when the user manually picks courses and you want university predictions.

export function useMultiCoursePrediction() {
  const [result, setResult] = useState<MultiCoursePredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(
    async (input: MultiCoursePredictionInput): Promise<MultiCoursePredictionResult | null> => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await getMultiCoursePredictions(input);
        setResult(data);
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const successfulPredictions =
    result?.predictions.filter((p) => p.error === null && p.top_predictions !== null) ?? [];

  const failedCourses =
    result?.predictions.filter((p) => p.error !== null) ?? [];

  return { predict, result, loading, error, reset, successfulPredictions, failedCourses };
}

// ─── Rule-Based Recommendation Hook ─────────────────────────────────────────
//
// Calls POST /predict/rule-based — no ML model required.
// Usage:
//   const { recommend, result, loading, error } = useRuleBasedRecommendation();
//   await recommend(studentProfile, 10);

export function useRuleBasedRecommendation() {
  const [result, setResult] = useState<CourseRecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommend = useCallback(
    async (
      profile: StudentProfile,
      topN = 10,
      diversity = true
    ): Promise<CourseRecommendationResult | null> => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await getRuleBasedRecommendations(profile, topN, diversity);
        setResult(data);
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const topCourse = result?.recommendations[0] ?? null;

  return { recommend, result, loading, error, reset, topCourse };
}

// ─── Health Hook ──────────────────────────────────────────────────────────────

export function useApiHealth() {
  const [healthy, setHealthy] = useState<boolean | null>(null);

  const check = useCallback(async () => {
    const ok = await checkApiHealth();
    setHealthy(ok);
    return ok;
  }, []);

  return { healthy, check };
}