'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

export interface CareerQuizAnswer {
    questionId: string;
    answer: number;
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
        id: "q1_science_tech",
        question: "How interested are you in exploring scientific principles, working with advanced technology, gadgets, or solving problems using tools like computers and machines?",
        description: "(e.g., careers in Engineering, Computer Science, Physical Science)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q2_healthcare",
        question: "How interested are you in helping people stay healthy, understanding the human body, treating illnesses, or working in medical settings?",
        description: "(e.g., careers in Medicine, Nursing, Pharmacy, Biological Science)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q3_design",
        question: "How interested are you in creating visual designs, planning buildings/layouts, fashion, or innovative products through drawing and creativity?",
        description: "(e.g., careers in Architecture, Fashion Design, Landscape Architecture)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q4_data",
        question: "How interested are you in analyzing numbers, statistics, data patterns, programming, or using information systems to make decisions?",
        description: "(e.g., careers in Information Systems, Computer Science, Statistics)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q5_business",
        question: "How interested are you in managing money, starting businesses, marketing products, or leading teams in commercial environments?",
        description: "(e.g., careers in Management, Commerce, Finance, Entrepreneurship)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q6_arts_culture",
        question: "How interested are you in expressing yourself through art, music, drama, literature, or preserving cultural heritage?",
        description: "(e.g., careers in Arts, Mass Communication, Performing Arts, Visual Arts)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q7_nature_env",
        question: "How interested are you in protecting the environment, working with plants/animals, agriculture, or sustainable natural resources?",
        description: "(e.g., careers in Agriculture, Environmental Conservation, Animal Science, Green Technology)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q8_hands_on",
        question: "How interested are you in practical, hands-on work like building, repairing machines, experimenting in labs, or technical fieldwork?",
        description: "(e.g., careers in Engineering Technology, Biosystems Technology)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q9_innovation",
        question: "How interested are you in inventing new ideas, researching cutting-edge solutions, or developing innovative technologies/products?",
        description: "(e.g., careers in Software Engineering, Biotechnology, Artificial Intelligence)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q10_people_social",
        question: "How interested are you in working with people, teaching, counseling, social work, or community development?",
        description: "(e.g., careers in Social Work, Peace & Conflict Resolution, Teaching, Law)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q11_urban_corporate",
        question: "How interested are you in city planning, corporate offices, urban development, facilities management, or big business environments?",
        description: "(e.g., careers in Urban Planning, Facilities Management, Quantity Surveying)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
    },
    {
        id: "q12_flexible_path",
        question: "How interested are you in careers with varied daily tasks, freedom to choose projects, or non-traditional/flexible work options?",
        description: "(e.g., careers in Translation Studies, Project Management, Tourism & Hospitality)",
        type: "rating",
        scale: "1 = Not interested at all, 5 = Extremely interested"
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">{currentQuestion.question}</h3>
                {currentQuestion.description && (
                    <p className="text-sm text-cyan-600 mb-8 italic">{currentQuestion.description}</p>
                )}

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
                                className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center transition-all ${selectedAnswer === rating
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

                {/* Scale Labels for Rating */}
                {isRatingQuestion && (
                    <div className="flex justify-between text-xs text-gray-500 mt-4 px-4">
                        <span>1 = Not interested at all</span>
                        <span>2 = Slightly</span>
                        <span>3 = Moderate</span>
                        <span>4 = Very</span>
                        <span>5 = Extremely interested</span>
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
                        className={`w-2 h-2 rounded-full transition-all ${idx < questionNumber ? 'bg-cyan-500' : idx === questionNumber - 1 ? 'bg-cyan-400' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export { quizQuestions };
