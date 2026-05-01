"use client";

import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  question: string;
}

export default function ProbSection() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(15).fill(0));
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/data/probQuestions.json")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      });
  }, []);

  const handleSelect = (value: number) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await submitEvaluation();
    }
  };

  const submitEvaluation = async () => {
    const payload = {
      name: "Student",
      age: 20,
      answers: answers,
    };

    const res = await fetch("http://localhost:8000/predict-and-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    localStorage.setItem("problemSolvingResult", JSON.stringify(result));
    router.push("/soft-skills/prob-recommendation");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
        <p className="text-indigo-300 text-lg">Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 flex justify-center items-start gap-6 pt-12">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div className="font-semibold text-sm text-indigo-300">
          Q: {currentIndex + 1} of {questions.length}
        </div>

        <p className="text-white leading-relaxed text-base">
          {currentQuestion.question}
        </p>

        <p className="font-semibold text-white/70 text-sm">
          What is your level of agreement?
        </p>

        <div className="space-y-3">
          {[
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all ${
                answers[currentIndex] === opt.value
                  ? "border-indigo-500 bg-indigo-500/20 text-white"
                  : "border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <input
                type="radio"
                checked={answers[currentIndex] === opt.value}
                onChange={() => handleSelect(opt.value)}
                className="accent-indigo-500"
              />
              <span>
                {opt.value} — {opt.label}
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              localStorage.removeItem("problemSolvingResult");
              router.push("/soft-skills");
            }}
            className="px-4 py-2 border border-red-500/40 rounded-xl bg-red-600/20 text-red-400 flex items-center gap-2 text-sm hover:bg-red-600/30 transition-all"
          >
            <LogOut size={16} /> Exit Evaluation
          </button>

          <button
            onClick={handleNext}
            disabled={answers[currentIndex] === 0}
            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          >
            {currentIndex === questions.length - 1
              ? "Submit Evaluation"
              : "Save and Next"}
          </button>
        </div>
      </div>

      <div className="w-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 text-center shadow-2xl flex-shrink-0">
        <div>
          <p className="text-white/60 text-xs mb-1">Progress</p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{
                width: `${(answers.filter((a) => a !== 0).length / 15) * 100}%`,
              }}
            />
          </div>
          <p className="text-indigo-300 text-xs mt-1">
            {answers.filter((a) => a !== 0).length}/15 answered
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2 text-sm">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                answers[i] !== 0
                  ? "bg-emerald-500/30 border-emerald-500/50 text-emerald-300"
                  : "border-white/10 text-white/40 hover:bg-white/10"
              } ${i === currentIndex ? "ring-2 ring-indigo-400 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
