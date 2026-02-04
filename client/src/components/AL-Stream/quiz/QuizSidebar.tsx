import React from "react";
import { CheckCircle } from "lucide-react";

interface Question {
    id: number;
    question: string;
    options: { [key: string]: string };
    question_type: string;
}

interface QuizSidebarProps {
    questions: Question[];
    userAnswers: { [key: number]: string };
    currentQuestion: number;
    onQuestionClick: (index: number) => void;
}

export default function QuizSidebar({
    questions,
    userAnswers,
    currentQuestion,
    onQuestionClick,
}: QuizSidebarProps) {
    const totalQuestions = questions.length;
    const progress = (Object.keys(userAnswers).length / totalQuestions) * 100;

    return (
        <div>
            <div className="sticky top-4 p-4 sm:p-5 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
                <div className="mb-4">
                    <h3 className="mb-2 text-base font-bold text-slate-800">
                        Quiz Progress
                    </h3>
                    <div className="flex items-center justify-between mb-2 text-xs text-slate-500 font-medium">
                        <span>Answered</span>
                        <span className="font-bold text-cyan-600">
                            {Object.keys(userAnswers).length}/{totalQuestions}
                        </span>
                    </div>
                    <div className="w-full h-2 overflow-hidden bg-slate-100 rounded-full">
                        <div
                            className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                    <h4 className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Question Navigator
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => onQuestionClick(idx)}
                                className={`
                                    relative aspect-square rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center
                                    ${currentQuestion === idx
                                        ? "ring-2 ring-cyan-500 ring-offset-2 scale-110 z-10"
                                        : "hover:bg-slate-100 hover:text-slate-900"
                                    }
                                    ${userAnswers[q.id]
                                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md border-transparent"
                                        : "bg-slate-50 text-slate-400 border border-slate-100"
                                    }
                                `}
                            >
                                {idx + 1}
                                {userAnswers[q.id] && (
                                    <div className="absolute -top-1 -right-1 flex items-center justify-center w-3 h-3 bg-white rounded-full shadow-sm">
                                        <CheckCircle className="w-2 h-2 text-emerald-600" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600"></div>
                            <span className="text-xs font-medium text-slate-500">Answered</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div>
                            <span className="text-xs font-medium text-slate-500">Pending</span>
                        </div>
                    </div>
                    <div className="p-3 border border-cyan-100 rounded-xl bg-cyan-50/50">
                        <p className="text-xs text-cyan-800 leading-relaxed font-medium">
                            <strong>Tip:</strong> Click any question number to verify or change your answer.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
