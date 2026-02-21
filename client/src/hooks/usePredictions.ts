import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PredictionInput {
  Year: number;
  Stream: string;
  Subject_1: string; Grade_1: string;
  Subject_2: string; Grade_2: string;
  Subject_3: string; Grade_3: string;
  Z_Score: number;
  Island_Rank: number;
  District: string;
  Gen_Test: number;
  'Sinhala/Tamil': string;
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
  Course: string;
}

export interface PredictionResult {
  predicted_university: string;
  course: string;
  input_summary: {
    stream: string;
    z_score: number;
    island_rank: number;
    district: string;
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export function usePrediction() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = async (input: PredictionInput): Promise<PredictionResult | null> => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Log payload so we can catch field mismatches early
    console.log('📤 Prediction payload:', JSON.stringify(input, null, 2));

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('❌ API error response:', err);

        // FastAPI 422 returns { detail: [ { loc, msg, type }, ... ] }
        // FastAPI 500 returns { detail: "string" }
        let message: string;
        if (typeof err.detail === 'string') {
          message = err.detail;
        } else if (Array.isArray(err.detail)) {
          // Extract human-readable field errors
          message = err.detail
            .map((e: any) => `${e.loc?.slice(1).join(' → ')}: ${e.msg}`)
            .join(' | ');
        } else {
          message = 'Prediction failed';
        }

        throw new Error(message);
      }

      const data: PredictionResult = await res.json();
      console.log('✅ Prediction result:', data);
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { predict, result, loading, error, reset };
}