// lib/predict.ts

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
  "Sinhala/Tamil": string;
  English: string;
  Maths: string;
  Science: string;
  q1_science_tech: number;  q2_healthcare: number;
  q3_design: number;        q4_data: number;
  q5_business: number;      q6_arts_culture: number;
  q7_nature_env: number;    q8_hands_on: number;
  q9_innovation: number;    q10_people_social: number;
  q11_urban_corporate: number; q12_flexible_path: number;
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getPrediction(input: PredictionInput): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Prediction failed");
  }

  return res.json();
}

// ── Usage in a React component ──────────────────────────────────────────────
//
// const [result, setResult] = useState<PredictionResult | null>(null);
//
// const handleSubmit = async (formData: PredictionInput) => {
//   try {
//     const prediction = await getPrediction(formData);
//     setResult(prediction);
//   } catch (err) {
//     console.error(err);
//   }
// };