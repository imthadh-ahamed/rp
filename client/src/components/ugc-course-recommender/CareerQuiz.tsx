'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

export interface CareerQuizAnswer {
    questionId: number;
    answer: string | number;
}

interface CareerQuizProps {
    questionNumber: number;
    totalQuestions: number;
    onNext: (answer: string | number) => void;
    onPrevious: () => void;
    isLoading?: boolean;
}

const quizQuestions = [
    {
        id: 1,
        question: "How interested are you in designing structures or buildings?",
        type: "rating",
        scale: "Not Interested to Very Interested"
    },
    {
        id: 2,
        question: "Do you prefer technical or creative careers?",
        type: "choice",
        options: ["Technical", "Creative"]
    },
    {
        id: 3,
        question: "Would you prefer fieldwork or office-based work?",
        type: "choice",
        options: ["Fieldwork", "Office-based"]
    },
    {
        id: 4,
        question: "How interested are you in mathematics and calculations?",
        type: "rating",
        scale: "Not Interested to Very Interested"
    },
    {
        id: 5,
        question: "Are you more data-oriented or people-oriented?",
        type: "choice",
        options: ["Data-oriented", "People-oriented"]
    },
    {
        id: 6,
        question: "How interested are you in innovation and new technologies?",
        type: "rating",
        scale: "Not Interested to Very Interested"
    },
    {
        id: 7,
        question: "Do you prefer urban or rural work settings?",
        type: "choice",
        options: ["Urban", "Rural"]
    },
    {
        id: 8,
        question: "Do you enjoy problem-solving and analytical thinking?",
        type: "choice",
        options: ["Yes", "No"]
    },
    {
        id: 9,
        question: "How interested are you in sustainable development and environment?",
        type: "rating",
        scale: "Not Interested to Very Interested"
    },
    {
        id: 10,
        question: "Do you prefer leadership roles or individual work?",
        type: "choice",
        options: ["Leadership", "Individual"]
    }
];

export default function CareerQuiz({ questionNumber, totalQuestions, onNext, onPrevious, isLoading = false }: CareerQuizProps) {
    const currentQuestion = quizQuestions[questionNumber - 1];
    const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');

    const handleNext = () => {
        if (selectedAnswer !== '') {
            onNext(selectedAnswer);
        }
    };

    const isRatingQuestion = currentQuestion.type === 'rating';
    const isChoiceQuestion = currentQuestion.type === 'choice';

    // Calculate progress percentage
    const progressPercentage = (questionNumber / totalQuestions) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl"
        >
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Career Interest Quiz</h2>
                    <span className="text-sm font-medium text-gray-600">Question {questionNumber} of {totalQuestions}</span>
                </div>
                <p className="text-gray-600 mb-6">Answer these questions to help us understand your career preferences and interests.</p>
                <div className="w-full h-3 bg-gradient-to-r from-cyan-600 to-teal-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            {/* Question */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-8">{currentQuestion.question}</h3>

                {/* Rating Question */}
                {isRatingQuestion && (
                    <div className="flex justify-center gap-4 mb-6">
                        {[1, 2, 3, 4, 5].map(rating => (
                            <motion.button
                                key={rating}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setSelectedAnswer(rating)}
                                className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                                    selectedAnswer === rating
                                        ? 'bg-cyan-500 border-cyan-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-600 hover:border-cyan-400'
                                }`}
                            >
                                <Star className="w-6 h-6 mb-1" />
                                <span className="text-sm font-bold">{rating}</span>
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Choice Question */}
                {isChoiceQuestion && (
                    <div className="grid grid-cols-2 gap-4">
                        {currentQuestion.options?.map((option, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setSelectedAnswer(option)}
                                className={`py-4 px-6 rounded-lg border-2 font-medium transition-all text-center ${
                                    selectedAnswer === option
                                        ? 'bg-cyan-500 border-cyan-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-700 hover:border-cyan-400'
                                }`}
                            >
                                {option}
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Scale Labels for Rating */}
                {isRatingQuestion && (
                    <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
                        <span>Not Interested</span>
                        <span>Very Interested</span>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onPrevious}
                    disabled={questionNumber === 1}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    ← Previous
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNext}
                    disabled={selectedAnswer === '' || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : questionNumber === totalQuestions ? (
                        'View Recommendations →'
                    ) : (
                        'Next Question →'
                    )}
                </motion.button>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalQuestions }).map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                            idx < questionNumber ? 'bg-cyan-500' : idx === questionNumber - 1 ? 'bg-cyan-400' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export { quizQuestions };
