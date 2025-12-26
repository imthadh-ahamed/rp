'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { Course } from '@/utils/recommendationEngine';

interface AptitudeQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    type: 'multiple-choice' | 'text';
}

interface AptitudeTestQuizProps {
    course: Course;
    testName: string;
    onBack: () => void;
}

// Mock aptitude test questions
const aptitudeQuestions: Record<string, AptitudeQuestion[]> = {
    'Logical Reasoning': [
        {
            id: 1,
            question: 'What is the next number in the sequence: 2, 4, 8, 16, ?',
            options: ['24', '32', '28', '20'],
            correctAnswer: '32',
            type: 'multiple-choice'
        },
        {
            id: 2,
            question: 'If all roses are flowers and some flowers are red, then which statement must be true?',
            options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined'],
            correctAnswer: 'Cannot be determined',
            type: 'multiple-choice'
        },
        {
            id: 3,
            question: 'A is taller than B. B is taller than C. Which is the tallest?',
            options: ['A', 'B', 'C', 'Cannot be determined'],
            correctAnswer: 'A',
            type: 'multiple-choice'
        },
        {
            id: 4,
            question: 'If 3x + 5 = 20, what is the value of x?',
            options: ['3', '5', '8', '15'],
            correctAnswer: '5',
            type: 'multiple-choice'
        },
        {
            id: 5,
            question: 'Which word is different from the others?',
            options: ['Cat', 'Dog', 'Tree', 'Bird'],
            correctAnswer: 'Tree',
            type: 'multiple-choice'
        }
    ],
    'Problem Solving': [
        {
            id: 1,
            question: 'A train travels 60 km in 2 hours. What is its average speed?',
            options: ['20 km/h', '30 km/h', '40 km/h', '50 km/h'],
            correctAnswer: '30 km/h',
            type: 'multiple-choice'
        },
        {
            id: 2,
            question: 'If a book costs Rs. 500 and you get 20% discount, how much do you pay?',
            options: ['Rs. 300', 'Rs. 350', 'Rs. 400', 'Rs. 450'],
            correctAnswer: 'Rs. 400',
            type: 'multiple-choice'
        },
        {
            id: 3,
            question: 'A rectangle has a length of 10 cm and width of 5 cm. What is its area?',
            options: ['15 cm²', '30 cm²', '50 cm²', '75 cm²'],
            correctAnswer: '50 cm²',
            type: 'multiple-choice'
        },
        {
            id: 4,
            question: 'What is 25% of 200?',
            options: ['25', '50', '75', '100'],
            correctAnswer: '50',
            type: 'multiple-choice'
        },
        {
            id: 5,
            question: 'If you have 10 apples and eat 3, how many are left?',
            options: ['5', '7', '8', '13'],
            correctAnswer: '7',
            type: 'multiple-choice'
        }
    ],
    'Data Structures': [
        {
            id: 1,
            question: 'What is the time complexity of searching in a binary search tree (average case)?',
            options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 'O(log n)',
            type: 'multiple-choice'
        },
        {
            id: 2,
            question: 'Which data structure uses LIFO (Last In First Out)?',
            options: ['Queue', 'Stack', 'Array', 'Linked List'],
            correctAnswer: 'Stack',
            type: 'multiple-choice'
        },
        {
            id: 3,
            question: 'What is the space complexity of a linked list?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 'O(n)',
            type: 'multiple-choice'
        },
        {
            id: 4,
            question: 'Which sorting algorithm has the best average case complexity?',
            options: ['Bubble Sort', 'Quick Sort', 'Insertion Sort', 'Selection Sort'],
            correctAnswer: 'Quick Sort',
            type: 'multiple-choice'
        },
        {
            id: 5,
            question: 'What is a hash table primarily used for?',
            options: ['Sorting data', 'Fast lookup', 'Tree traversal', 'Graph representation'],
            correctAnswer: 'Fast lookup',
            type: 'multiple-choice'
        }
    ]
};

export default function AptitudeTestQuiz({ course, testName, onBack }: AptitudeTestQuizProps) {
    const questions = aptitudeQuestions[testName] || [];
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const currentQ = questions[currentQuestion];
    const totalQuestions = questions.length;
    const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

    const handleSelectAnswer = (answer: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setSubmitted(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    // Calculate results
    const calculateResults = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                correct++;
            }
        });
        return { correct, total: totalQuestions, percentage: Math.round((correct / totalQuestions) * 100) };
    };

    if (submitted) {
        const results = calculateResults();
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Test Results</h2>

                {/* Overall Score */}
                <div className="mb-8 p-8 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg border border-cyan-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Overall Performance</h3>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-cyan-600" />
                            <span className="text-3xl font-bold text-cyan-600">{results.percentage}%</span>
                        </div>
                    </div>
                    <p className="text-gray-600">You answered {results.correct} out of {results.total} questions correctly.</p>
                </div>

                {/* Answer Review */}
                <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Answer Review</h3>
                    {questions.map((q, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`p-4 rounded-lg border-2 ${
                                answers[idx] === q.correctAnswer
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {answers[idx] === q.correctAnswer ? (
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                                    <div className="space-y-1 text-sm">
                                        <p className={answers[idx] === q.correctAnswer ? 'text-green-700' : 'text-red-700'}>
                                            Your answer: <strong>{answers[idx] || 'Not answered'}</strong>
                                        </p>
                                        {answers[idx] !== q.correctAnswer && (
                                            <p className="text-green-700">
                                                Correct answer: <strong>{q.correctAnswer}</strong>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onBack}
                        className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-all"
                    >
                        ← Back to Recommendations
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setCurrentQuestion(0);
                            setAnswers({});
                            setSubmitted(false);
                        }}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-teal-600 transition-all"
                    >
                        Try Again
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl"
        >
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors mb-6 font-medium text-sm"
                >
                    ← Back to Tests
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{testName}</h2>
                    <span className="text-sm font-medium text-gray-600">Question {currentQuestion + 1} of {totalQuestions}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                    />
                </div>
            </div>

            {/* Question */}
            {currentQ && (
                <div className="mb-12">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">{currentQ.question}</h3>
                    <div className="space-y-3">
                        {currentQ.options.map((option, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSelectAnswer(option)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                    answers[currentQuestion] === option
                                        ? 'bg-cyan-500 border-cyan-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-700 hover:border-cyan-400'
                                }`}
                            >
                                {option}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    ← Previous
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={!answers[currentQuestion]}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {currentQuestion === totalQuestions - 1 ? 'Submit Test' : 'Next Question'} →
                </motion.button>
            </div>
        </motion.div>
    );
}
