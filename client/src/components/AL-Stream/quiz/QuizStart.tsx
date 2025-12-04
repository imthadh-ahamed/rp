import React from "react";
import { BookOpen, CheckCircle, Target, Edit3, Loader2 } from "lucide-react";
import ErrorAlert from "../shared/ErrorAlert";

interface QuizStartProps {
    initialStream: string | null;
    showCustomStreamOption: boolean;
    customStream: string;
    setCustomStream: (stream: string) => void;
    streams: string[];
    loading: boolean;
    error: string;
    onGenerateQuiz: () => void;
    onBackToPredictor: () => void;
}

export default function QuizStart({
    initialStream,
    showCustomStreamOption,
    customStream,
    setCustomStream,
    streams,
    loading,
    error,
    onGenerateQuiz,
    onBackToPredictor,
}: QuizStartProps) {
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="overflow-hidden bg-white shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-100">
                    {/* Header */}
                    <div className="p-8 bg-gradient-to-r from-cyan-600 to-teal-600 relative overflow-hidden">
                        {/* Decorative patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24"></div>

                        <div className="relative flex items-center gap-5 mb-3">
                            <div className="p-3.5 bg-white/20 shadow-inner rounded-2xl backdrop-blur-md border border-white/20">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white md:text-4xl tracking-tight">
                                    A/L Stream Quiz
                                </h1>
                                <p className="mt-2 text-cyan-50 font-medium text-lg opacity-90">
                                    Test your knowledge with AI-generated questions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10">
                        {initialStream && !showCustomStreamOption && (
                            <div className="relative mb-10 overflow-hidden border border-emerald-100 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
                                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-emerald-200/30 rounded-full blur-xl"></div>
                                <div className="relative p-8">
                                    <div className="flex items-start gap-5">
                                        <div className="flex items-center justify-center flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm border border-emerald-100 text-3xl">
                                            🎯
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-3 py-1 text-xs font-bold tracking-wide text-emerald-700 uppercase bg-emerald-100/80 rounded-full border border-emerald-200">
                                                    Recommended Stream
                                                </span>
                                            </div>
                                            <h2 className="mb-3 text-3xl font-bold text-slate-800">
                                                {initialStream.replace(/_/g, " ").toUpperCase()}
                                            </h2>
                                            <p className="text-base leading-relaxed text-slate-600 max-w-2xl">
                                                Based on your O/L performance, this stream aligns
                                                perfectly with your strengths. Take the quiz to validate
                                                your readiness!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showCustomStreamOption && (
                            <div className="mb-10 space-y-8">
                                {/* Success Banner */}
                                <div className="relative overflow-hidden border border-cyan-200 rounded-2xl bg-cyan-50/50">
                                    <div className="absolute bottom-0 right-0 w-40 h-40 transform translate-x-12 translate-y-12 bg-cyan-200/40 rounded-full blur-2xl"></div>
                                    <div className="relative p-8">
                                        <div className="flex items-start gap-5">
                                            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-white rounded-full shadow-sm text-cyan-500">
                                                <CheckCircle className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="mb-2 text-xl font-bold text-slate-800">
                                                    Quiz Completed! 🎉
                                                </h3>
                                                <p className="mb-2 text-slate-600">
                                                    Finished:{" "}
                                                    <span className="font-bold text-slate-800">
                                                        {initialStream?.replace(/_/g, " ").toUpperCase()}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-slate-500 font-medium">
                                                    Try another stream to compare and discover your best match!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stream Input */}
                                <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50/50">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                            <Target className="w-6 h-6 text-cyan-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">
                                                Choose a Stream to Compare
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Select or type a stream below to generate a comparison quiz
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative mb-6">
                                        <input
                                            type="text"
                                            value={customStream}
                                            onChange={(e) => setCustomStream(e.target.value)}
                                            placeholder="e.g., biological_science"
                                            className="w-full px-5 py-4 pl-12 text-base font-medium transition-all bg-white border border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:outline-none placeholder:text-slate-400 text-slate-800 shadow-sm"
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <Edit3 className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                                        <p className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            Available Streams
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {streams
                                                .filter(
                                                    (s) =>
                                                        s.toLowerCase() !== initialStream?.toLowerCase()
                                                )
                                                .map((stream) => (
                                                    <button
                                                        key={stream}
                                                        onClick={() => setCustomStream(stream)}
                                                        className="px-4 py-2 text-sm font-semibold text-slate-600 transition-all bg-slate-50 border border-slate-200 rounded-lg hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 hover:shadow-sm active:scale-95"
                                                    >
                                                        {stream.replace(/_/g, " ")}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mb-8">
                                <ErrorAlert message={error} />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-4">
                            <button
                                onClick={onGenerateQuiz}
                                disabled={
                                    loading || (showCustomStreamOption && !customStream.trim())
                                }
                                className="relative flex items-center justify-center w-full gap-3 py-5 overflow-hidden font-bold text-white transition-all shadow-xl shadow-cyan-900/10 group bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl hover:shadow-2xl hover:shadow-cyan-900/20 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                            >
                                <div className="absolute inset-0 w-full h-full transition-transform duration-500 transform -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full"></div>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span className="text-lg">Generating Your Quiz...</span>
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="w-5 h-5" />
                                        <span className="text-lg">
                                            {showCustomStreamOption
                                                ? "Start Comparison Quiz"
                                                : `Begin ${initialStream
                                                    ? initialStream.replace(/_/g, " ").toUpperCase()
                                                    : "Quiz"
                                                }`}
                                        </span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={onBackToPredictor}
                                className="w-full py-4 font-semibold text-slate-600 transition-all bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                            >
                                ← Back to Stream Predictor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
