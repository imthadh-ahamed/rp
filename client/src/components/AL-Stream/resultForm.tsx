"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const subjects = [
  "Religion",
  "Sinhala",
  "English",
  "Mathematics",
  "Science",
  "History",
  "1 Category",
  "2 Category",
  "3 Category",
];

export default function ResultForm() {
  const [term1Results, setTerm1Results] = useState(
    Object.fromEntries(subjects.map((s) => [s, ""]))
  );
  const [term2Results, setTerm2Results] = useState(
    Object.fromEntries(subjects.map((s) => [s, ""]))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTerm1Change = (subject: string, value: string) => {
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setTerm1Results((prev) => ({ ...prev, [subject]: value }));
    }
  };

  const handleTerm2Change = (subject: string, value: string) => {
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setTerm2Results((prev) => ({ ...prev, [subject]: value }));
    }
  };

  const calculateAverage = (subject: string) => {
    const t1 = parseFloat(term1Results[subject]) || 0;
    const t2 = parseFloat(term2Results[subject]) || 0;
    return ((t1 + t2) / 2).toFixed(1);
  };

  const getGrade = (subject: string) => {
    const average = parseFloat(calculateAverage(subject));

    if (average >= 75)
      return {
        grade: "A",
        color: "from-green-50 to-emerald-50 border-green-300 text-green-700",
      };
    if (average >= 65)
      return {
        grade: "B",
        color: "from-blue-50 to-cyan-50 border-blue-300 text-blue-700",
      };
    if (average >= 55)
      return {
        grade: "C",
        color: "from-yellow-50 to-amber-50 border-yellow-300 text-yellow-700",
      };
    if (average >= 35)
      return {
        grade: "S",
        color: "from-orange-50 to-orange-100 border-orange-300 text-orange-700",
      };
    return {
      grade: "F",
      color: "from-red-50 to-rose-50 border-red-300 text-red-700",
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const results = subjects.map((subject) => {
      const avg = calculateAverage(subject);
      const { grade } = getGrade(subject);
      return {
        subject,
        term1: term1Results[subject],
        term2: term2Results[subject],
        average: avg,
        grade, // include grade in payload
      };
    });

    console.log("Submitted Results:", results);
    alert("Results submitted successfully! Analyzing your best A/L stream...");
    setIsSubmitting(false);
  };

  const isFormValid = () => {
    return subjects.every(
      (subject) => term1Results[subject] !== "" && term2Results[subject] !== ""
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-3xl p-8 mb-8 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            A/L Stream Guidance
          </h1>
          <p className="text-cyan-50 text-lg">
            Enter your O/L results from the last 2 terms to get personalized
            stream recommendations
          </p>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-100"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">Instructions</h2>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Enter your marks (0-100) for each subject for both terms
                </li>
                <li>
                  • All fields are required for accurate stream prediction
                </li>
                <li>• Your average and grade are calculated automatically</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Results Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
            <div className="grid grid-cols-4 gap-4 text-white font-semibold">
              <div>Subject</div>
              <div className="text-center">Term 1</div>
              <div className="text-center">Term 2</div>
              <div className="text-center">Grade</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {subjects.map((subject, idx) => (
              <motion.div
                key={subject}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* Subject Name */}
                <div className="flex items-center font-medium text-gray-800">
                  {subject}
                </div>

                {/* Term 1 Input */}
                <div className="flex items-center justify-center text-gray-800">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={term1Results[subject]}
                    onChange={(e) => handleTerm1Change(subject, e.target.value)}
                    placeholder="0-100"
                    className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg text-center focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Term 2 Input */}
                <div className="flex items-center justify-center text-gray-800">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={term2Results[subject]}
                    onChange={(e) => handleTerm2Change(subject, e.target.value)}
                    placeholder="0-100"
                    className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg text-center focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Grade Badge (with avg caption) */}
                <div className="flex items-center justify-center">
                  {term1Results[subject] && term2Results[subject] ? (
                    (() => {
                      const { grade, color } = getGrade(subject);
                      const avg = calculateAverage(subject);
                      return (
                        <div
                          className={`w-24 px-3 py-2 bg-gradient-to-r border-2 rounded-lg text-center font-bold ${color}`}
                          title={`Average: ${avg}`}
                        >
                          {grade}
                          <div className="text-[11px] font-medium opacity-70 mt-0.5 leading-none">
                            {avg}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="w-24 px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-center text-gray-400">
                      -
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gray-50">
            <motion.button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              whileHover={{ scale: isFormValid() ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid() ? 0.98 : 1 }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                isFormValid() && !isSubmitting
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Get Stream Recommendations"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
