import React from "react";
import { Award, TrendingUp, CheckCircle2, BookOpen } from "lucide-react";
import StatCard from "./StatCard";
import { PredictorResultsProps } from "../../../types/predictor.types";

export default function PredictorResults({ results, onTakeQuiz, onReset }: PredictorResultsProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Section: Recommendations & Main Stats */}
            <div className="grid lg:grid-cols-5 gap-8">

                {/* Left: Recommendations (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl shadow-xl overflow-hidden text-white relative">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24"></div>

                        <div className="relative p-8">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Award className="w-8 h-8 mr-3 text-cyan-200" />
                                Recommended Streams
                            </h2>

                            <div className="space-y-4">
                                {results.top_recommendations.map((rec, idx) => (
                                    <div
                                        key={idx}
                                        className={`
                                            relative p-6 rounded-xl border backdrop-blur-sm transition-all
                                            ${idx === 0
                                                ? "bg-white/10 border-white/20 shadow-lg"
                                                : "bg-black/20 border-white/5 opacity-90"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`
                                                    flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl shadow-inner
                                                    ${idx === 0 ? "bg-yellow-400 text-yellow-900" : "bg-slate-200 text-slate-600"}
                                                `}>
                                                    {idx === 0 ? "1" : "2"}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold tracking-tight">
                                                        {rec.stream}
                                                    </h3>
                                                    <p className="text-cyan-100 text-sm font-medium opacity-90">
                                                        {idx === 0 ? "Primary Recommendation" : "Alternative Option"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold">{rec.confidence.toFixed(1)}%</div>
                                                <div className="text-xs text-cyan-200 uppercase tracking-wider font-semibold">Match</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-300 to-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                                style={{ width: `${rec.confidence}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Interpretation Card */}
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">AI Analysis</h3>
                        <p className="text-slate-700 leading-relaxed text-lg">
                            {results.interpretation}
                        </p>
                    </div>
                </div>

                {/* Right: Performance Stats (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                        <h2 className="flex items-center mb-6 text-xl font-bold text-slate-800">
                            <TrendingUp className="w-6 h-6 mr-3 text-cyan-600" />
                            Performance Insights
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Aptitude Highlights */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Key Aptitudes</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-600">STEM Aptitude</span>
                                        <span className="text-lg font-bold text-cyan-700">{results.student_summary.stem_aptitude.toFixed(2)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${results.student_summary.stem_aptitude}%` }}></div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-sm font-medium text-slate-600">Humanities</span>
                                        <span className="text-lg font-bold text-purple-600">{results.student_summary.humanities_aptitude.toFixed(2)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${results.student_summary.humanities_aptitude}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <StatCard label="Math" value={results.student_summary.mathematics} />
                                <StatCard label="Science" value={results.student_summary.science} />
                                <StatCard label="English" value={results.student_summary.english} />
                                <StatCard label="First Lang" value={results.student_summary.first_language} />
                                <StatCard label="M/S Avg" value={results.student_summary.math_science_avg} highlight />
                                <StatCard label="Lang Avg" value={results.student_summary.language_avg} highlight />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                    onClick={() =>
                        onTakeQuiz(
                            results.top_recommendations[0].stream
                                .toLowerCase()
                                .replace(/ /g, "_")
                        )
                    }
                    className="group relative flex items-center justify-center px-8 py-4 font-bold text-white transition-all bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl shadow-lg hover:shadow-cyan-200/50 hover:scale-[1.02]"
                >
                    <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:bg-white/10 rounded-xl transition-all"></span>
                    <BookOpen className="w-5 h-5 mr-3" />
                    Take Accuracy Quiz for {results.top_recommendations[0].stream}
                </button>

                <button
                    onClick={onReset}
                    className="flex items-center justify-center px-8 py-4 font-semibold text-slate-600 transition-all bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300"
                >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Check Another Student
                </button>
            </div>
        </div>
    );
}
