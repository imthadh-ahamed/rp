'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RecommendedCourse } from '@/utils/recommendationEngine';
import {
    getHealth,
    generateQuestions,
    QuestionType,
    AnyQuestion,
    GenerateResponse,
} from '@/services/aptitudeApi';

interface AptitudeTestListProps {
    course: RecommendedCourse;
    onSelectTest: (testName: string) => void;
    onBack: () => void;
    /** Called when AI question generation completes */
    onStartAIQuiz?: (
        questions: AnyQuestion[],
        type: QuestionType,
    ) => void;
}

const COUNT_OPTIONS = [3, 5, 10] as const;

const QUESTION_TYPES: { value: QuestionType; label: string; icon: string; desc: string }[] = [
    {
        value: 'structured',
        label: 'Structured',
        icon: 'ðŸ“',
        desc: '4-option MCQ with full explanation',
    },
    {
        value: 'mini_structured',
        label: 'Mini Structured',
        icon: 'âš¡',
        desc: 'Short 2â€“4 option quick-reasoning check',
    },
    {
        value: 'essay',
        label: 'Essay',
        icon: 'âœï¸',
        desc: 'Open-ended written response with model answer',
    },
];

export default function AptitudeTestList({
    course,
    onSelectTest,
    onBack,
    onStartAIQuiz,
}: AptitudeTestListProps) {
    // â”€â”€ AI panel state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const [qType, setQType]           = useState<QuestionType>('structured');
    const [count, setCount]           = useState<3 | 5 | 10>(5);
    const [generating, setGenerating] = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
    // session_id persists across multiple Generate presses to avoid repeats
    const [sessionId, setSessionId]   = useState<string | undefined>(undefined);

    useEffect(() => {
        getHealth()
            .then(() => setApiAvailable(true))
            .catch(() => setApiAvailable(false));
    }, []);

    const handleGenerate = async () => {
        if (!onStartAIQuiz) return;
        setGenerating(true);
        setError(null);
        try {
            const res: GenerateResponse = await generateQuestions(qType, count, sessionId);
            setSessionId(res.session_id);
            onStartAIQuiz(res.questions, qType);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Generation failed');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl"
        >
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors mb-6 font-medium text-sm"
                >
                    â† Back to Recommendations
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Aptitude Test Practice</h2>
                <p className="text-gray-600">
                    Generate a fresh AI-powered quiz grounded in real UOM past-paper data.
                </p>
            </div>

            {/* Course Info */}
            <div className="mb-8 p-6 bg-cyan-50 rounded-lg border border-cyan-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.courseName}</h3>
                <p className="text-gray-600">{course.university}</p>
            </div>

            {/* â”€â”€ AI Quiz Generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="mb-8 p-6 border-2 border-violet-200 rounded-xl bg-violet-50">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    <h3 className="text-lg font-bold text-violet-900">AI Quiz Generator</h3>
                    {apiAvailable === false && (
                        <span className="ml-auto text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                            API offline â€” start aptitude-ai server on :8001
                        </span>
                    )}
                    {apiAvailable === true && (
                        <span className="ml-auto text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            âœ“ Connected
                        </span>
                    )}
                </div>

                <p className="text-sm text-violet-700 mb-6">
                    Questions are generated by Groq (Llama 3) using RAG retrieval from real UOM
                    past papers, then validated with BERT. Choose a question type and count below.
                </p>

                {/* Question type selector */}
                <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                        Question Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {QUESTION_TYPES.map(({ value, label, icon, desc }) => (
                            <button
                                key={value}
                                onClick={() => setQType(value)}
                                disabled={!apiAvailable || generating}
                                className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all disabled:opacity-50 text-left ${
                                    qType === value
                                        ? 'border-violet-500 bg-violet-500 text-white'
                                        : 'border-violet-200 bg-white text-violet-700 hover:border-violet-400'
                                }`}
                            >
                                <span className="text-base">{icon} {label}</span>
                                <span className={`text-xs font-normal leading-tight ${qType === value ? 'text-violet-100' : 'text-gray-500'}`}>
                                    {desc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count selector */}
                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                        Number of Questions
                    </label>
                    <div className="flex gap-2">
                        {COUNT_OPTIONS.map((n) => (
                            <button
                                key={n}
                                onClick={() => setCount(n)}
                                disabled={!apiAvailable || generating}
                                className={`w-16 py-2.5 rounded-lg font-semibold text-sm border-2 transition-all disabled:opacity-50 ${
                                    count === n
                                        ? 'border-violet-500 bg-violet-500 text-white'
                                        : 'border-violet-200 bg-white text-violet-700 hover:border-violet-400'
                                }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                        >
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: apiAvailable && !generating ? 1.02 : 1 }}
                    whileTap={{ scale: apiAvailable && !generating ? 0.98 : 1 }}
                    onClick={handleGenerate}
                    disabled={!apiAvailable || generating || !onStartAIQuiz}
                    className="w-full py-3 px-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-semibold text-sm hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                    {generating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating with AIâ€¦</>
                    ) : (
                        <><Sparkles className="w-4 h-4" /> âœ¨ Generate AI Quiz</>
                    )}
                </motion.button>
            </div>

            {/* â”€â”€ Static test list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Practice Tests</h3>
                {course.aptitudeTests && course.aptitudeTests.length > 0 ? (
                    <div className="space-y-4">
                        {course.aptitudeTests.map((test, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelectTest(test)}
                                className="w-full text-left p-6 border-2 border-gray-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 transition-all">
                                        <BookOpen className="w-6 h-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{test}</h4>
                                        <p className="text-sm text-gray-600">Mock Test Â· Timed Assessment</p>
                                    </div>
                                </div>
                                <span className="text-cyan-600 font-bold group-hover:translate-x-2 transition-transform">â†’</span>
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-sm">No static practice tests for this course.</p>
                        <p className="text-gray-400 text-xs mt-1">Use the AI Quiz Generator above instead.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
