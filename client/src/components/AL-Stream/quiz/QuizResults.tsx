import React from "react";
import { Award, CheckCircle, XCircle } from "lucide-react";

interface Question {
    id: number;
    question: string;
    options: { [key: string]: string };
}

interface QuizResultItem {
    is_correct: boolean;
    user_answer: string;
    correct_answer: string;
}

interface QuizResultsData {
    score: number;
    total: number;
    percentage: number;
    results: QuizResultItem[];
}

interface QuizResultsProps {
    results: QuizResultsData;
    questions: Question[];
    streamName: string;
    onRetake: () => void;
    onBackToPredictor: () => void;
    showTryAnother: boolean;
    onTryAnotherStream: () => void;
}

export default function QuizResults({
    results,
    questions,
    streamName,
    onRetake,
    onBackToPredictor,
    showTryAnother,
    onTryAnotherStream,
}: QuizResultsProps) {
    const getGrade = (percentage: number) => {
        if (percentage >= 90)
            return { grade: "A+", color: "text-green-600", bg: "bg-green-50" };
        if (percentage >= 80)
            return { grade: "A", color: "text-green-600", bg: "bg-green-50" };
        if (percentage >= 70)
            return { grade: "B", color: "text-blue-600", bg: "bg-blue-50" };
        if (percentage >= 60)
            return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-50" };
        if (percentage >= 50)
            return { grade: "D", color: "text-orange-600", bg: "bg-orange-50" };
        return { grade: "F", color: "text-red-600", bg: "bg-red-50" };
    };

    const gradeInfo = getGrade(results.percentage);

    return (
        <div className="p-8 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-cyan-50 rounded-xl">
                    <Award className="w-8 h-8 text-cyan-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Quiz Results
                    </h2>
                    <p className="text-slate-500 font-medium">{streamName.replace(/_/g, " ").toUpperCase()}</p>
                </div>
            </div>

            <div className={`${gradeInfo.bg} rounded-2xl p-8 mb-10 border border-slate-100 shadow-sm relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -mr-16 -mt-16 blur-xl"></div>
                <div className="relative text-center">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className={`text-7xl font-bold ${gradeInfo.color} tracking-tighter filter drop-shadow-sm`}>
                            {results.percentage}%
                        </div>
                    </div>

                    <div className="text-xl font-medium text-slate-700">
                        You scored <span className="font-bold text-slate-900">{results.score}</span> out of <span className="font-bold text-slate-900">{results.total}</span>
                    </div>

                    <div className="mt-4 inline-block px-4 py-1 bg-white/60 rounded-full text-sm font-semibold text-slate-600 border border-slate-200/50">
                        Grade: {gradeInfo.grade}
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
                Detailed Breakdown
            </h3>

            <div className="mb-8 space-y-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {questions.map((q, idx) => {
                    const result = results.results[idx];
                    return (
                        <div
                            key={q.id}
                            className={`p-5 rounded-xl border transition-all ${result.is_correct
                                ? "border-emerald-100 bg-emerald-50/30"
                                : "border-red-100 bg-red-50/30"
                                } hover:shadow-sm`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 mt-1`}>
                                    {result.is_correct ? (
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <p className="font-semibold text-slate-800 text-lg">
                                            <span className="text-slate-400 mr-2 text-sm">#{idx + 1}</span>
                                            {q.question}
                                        </p>
                                    </div>

                                    <div className="space-y-2 text-sm mt-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-500 w-24">Your Answer:</span>
                                            <span
                                                className={`font-semibold px-2 py-0.5 rounded ${result.is_correct
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {result.user_answer} - {q.options[result.user_answer]}
                                            </span>
                                        </div>
                                        {!result.is_correct && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-500 w-24">Correct:</span>
                                                <span className="font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                                    {result.correct_answer} - {q.options[result.correct_answer]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                {showTryAnother && (
                    <button
                        onClick={onTryAnotherStream}
                        className="flex-1 py-3.5 font-bold text-white transition-all shadow-lg shadow-purple-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:scale-[1.02]"
                    >
                        Compare with Another Stream
                    </button>
                )}
                <button
                    onClick={onRetake}
                    className="flex-1 py-3.5 font-bold text-white transition-all shadow-lg shadow-cyan-200 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl hover:from-cyan-700 hover:to-teal-700 hover:shadow-xl hover:scale-[1.02]"
                >
                    {showTryAnother ? "Retake Quiz" : "Retake This Quiz"}
                </button>
                <button
                    onClick={onBackToPredictor}
                    className="px-8 py-3.5 font-bold text-slate-600 transition-all border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                >
                    Back
                </button>
            </div>
        </div>
    );
}
