import React from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import ErrorAlert from "../shared/ErrorAlert";

interface Question {
    id: number;
    question: string;
    options: { [key: string]: string };
    question_type: string;
}

interface QuizQuestionProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    userAnswer: string;
    onAnswerSelect: (questionId: number, answer: string) => void;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit: () => void;
    canGoBack: boolean;
    isLastQuestion: boolean;
    allAnswered: boolean;
    loading: boolean;
    error: string;
    userAnswers?: { [key: number]: string };
}

export default function QuizQuestion({
    question,
    questionNumber,
    totalQuestions,
    userAnswer,
    onAnswerSelect,
    onPrevious,
    onNext,
    onSubmit,
    canGoBack,
    isLastQuestion,
    allAnswered,
    loading,
    error,
    userAnswers = {},
}: QuizQuestionProps) {
    return (
        <div>
            <div className="p-4 sm:p-6 lg:p-8 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-100 rounded-full">
                            Question {questionNumber} of {totalQuestions}
                        </span>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase">
                            {question.question_type}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6">
                        <ErrorAlert message={error} />
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="mb-4 text-base sm:text-lg lg:text-xl font-bold leading-snug text-gray-800">
                        {question.question}
                    </h3>

                    <div className="space-y-2.5">
                        {Object.entries(question.options).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => onAnswerSelect(question.id, key)}
                                className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] ${userAnswer === key
                                    ? "border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg scale-[1.01]"
                                    : "border-gray-200 hover:border-indigo-300 hover:shadow-md hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`
                    flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base transition-all
                    ${userAnswer === key
                                                ? "bg-indigo-600 text-white shadow-lg"
                                                : "bg-gray-100 text-gray-500"
                                            }
                  `}
                                    >
                                        {key}
                                    </div>
                                    <span
                                        className={`text-sm sm:text-base leading-snug flex-1 ${userAnswer === key
                                            ? "text-gray-900 font-medium"
                                            : "text-gray-700"
                                            }`}
                                    >
                                        {value}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                    <button
                        onClick={onPrevious}
                        disabled={!canGoBack}
                        className="px-6 sm:px-8 py-3 font-semibold text-gray-700 transition-all bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                    >
                        ← Previous
                    </button>

                    {!isLastQuestion ? (
                        <button
                            onClick={onNext}
                            className="px-6 sm:px-8 py-3 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={onSubmit}
                            disabled={!allAnswered || loading}
                            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:shadow-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Submit Quiz
                                </>
                            )}
                        </button>
                    )}
                </div>

                {!allAnswered && isLastQuestion && (
                    <div className="flex items-start gap-2 p-3 mt-3 border-2 border-amber-300 rounded-xl text-amber-700 bg-amber-50 animate-in fade-in duration-300">
                        <AlertCircle className="flex-shrink-0 w-4 h-4 mt-0.5" />
                        <span className="text-xs sm:text-sm font-medium">
                            Please answer all questions before submitting (
                            {totalQuestions - Object.keys(userAnswers).length} remaining)
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
