"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CriticalThinking() {
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 flex justify-center items-start gap-6 pt-12">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="font-semibold text-sm text-indigo-300">
          Q: 1 — Essay Type Question
        </div>

        <p className="text-white/80 leading-relaxed">
          Write an essay on the topic below. Make sure your response is clear,
          structured, and includes relevant examples wherever possible.
        </p>

        <p className="font-semibold text-white text-lg">
          ✍️ Topic:
          <span className="font-normal block mt-1 text-white/80">
            &quot;For some people patriotism means loyalty to humanity as much
            as loyalty to any one country.&quot;
          </span>
        </p>

        <div>
          <label className="text-white/70 font-medium text-sm">
            Write your answer below:
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
            className="w-full mt-2 p-4 border border-white/10 rounded-xl text-white bg-white/5 outline-none focus:border-indigo-500 transition placeholder-white/30"
            placeholder="Type your essay here..."
          />
          <div className="text-right text-xs text-white/40 mt-1">
            Word count:{" "}
            {answer.trim() === "" ? 0 : answer.trim().split(/\s+/).length}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => router.push("/soft-skills")}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/40 rounded-xl bg-red-600/20 text-red-400 text-sm hover:bg-red-600/30 transition-all"
          >
            <LogOut size={16} /> Exit Evaluation
          </button>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-white/10 rounded-xl text-white/60 text-sm hover:bg-white/10 transition-all"
              onClick={() => setAnswer("")}
            >
              Clear Answer
            </button>
            <button className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
              Save and Next
            </button>
          </div>
        </div>
      </div>

      <div className="w-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6 text-center flex-shrink-0">
        <div>
          <div className="text-3xl font-bold text-white">02 : 59 : 59</div>
          <p className="text-xs text-white/40 mt-1">Hrs : Min : Sec</p>
        </div>

        <button className="w-full border border-white/10 rounded-xl py-2 text-white/60 text-sm hover:bg-white/10 transition-all">
          About Evaluation
        </button>
        <button className="w-full border border-white/10 rounded-xl py-2 text-white/60 text-sm hover:bg-white/10 transition-all">
          Read Instructions
        </button>

        <div className="grid grid-cols-5 gap-2 text-sm">
          {Array.from({ length: 25 }, (_, i) => (
            <button
              key={i}
              className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                i === 0
                  ? "bg-indigo-500/30 border-indigo-500/50 text-indigo-300"
                  : "border-white/10 text-white/30 hover:bg-white/10"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
