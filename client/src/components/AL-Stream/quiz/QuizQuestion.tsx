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
        <div className="lg:col-span-9">
            <div className="p-6 bg-white shadow-2xl rounded-2xl md:p-8">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-100 rounded-full">
                                Question {questionNumber} of {totalQuestions}
                            </span>
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase">
                                {question.question_type}
                            </span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6">
                        <ErrorAlert message={error} />
                    </div>
                )}

                <div className="mb-8">
                    <h3 className="mb-6 text-xl font-bold leading-relaxed text-gray-800 md:text-2xl">
                        {question.question}
                    </h3>

                    <div className="space-y-3">
                        {Object.entries(question.options).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => onAnswerSelect(question.id, key)}
                                className={`w-full text-left p-5 rounded-xl border-2 transition-all transform hover:scale-[1.01] ${userAnswer === key
                                    ? "border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg scale-[1.01]"
                                    : "border-gray-200 hover:border-indigo-300 hover:shadow-md hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`
                    flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all
                    ${userAnswer === key
                                                ? "bg-indigo-600 text-white shadow-lg"
                                                : "bg-gray-100 text-gray-500"
                                            }
                  `}
                                    >
                                        {key}
                                    </div>
                                    <span
                                        className={`text-base leading-relaxed ${userAnswer === key
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

                <div className="flex justify-between gap-4">
                    <button
                        onClick={onPrevious}
                        disabled={!canGoBack}
                        className="px-8 py-3 font-semibold text-gray-700 transition-all bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Previous
                    </button>

                    {!isLastQuestion ? (
                        <button
                            onClick={onNext}
                            className="px-8 py-3 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-xl hover:from-indigo-700 hover:to-purple-700"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={onSubmit}
                            disabled={!allAnswered || loading}
                            className="flex items-center gap-2 px-8 py-3 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:shadow-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
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
                    <div className="flex items-center gap-2 p-4 mt-4 border-2 border-amber-300 rounded-xl text-amber-700 bg-amber-50">
                        <AlertCircle className="flex-shrink-0 w-5 h-5" />
                        <span className="text-sm font-medium">
                            Please answer all questions before submitting (
                            {totalQuestions - Object.keys(userAnswers).length} remaining)
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
