'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, AlertCircle, Loader2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { RecommendedCourse } from '@/utils/recommendationEngine';
import { CombinedPredictionResult } from '@/lib/predict';
interface CourseRecommendationsProps {
    courses: RecommendedCourse[];
    onSelectCourse: (course: RecommendedCourse) => void;
    isLoading?: boolean;
    predicting?: boolean;
    predictionResult?: CombinedPredictionResult | null;
    predictionError?: string | null;
}

export default function CourseRecommendations({
    courses,
    onSelectCourse,
    isLoading = false,
    predicting = false,
    predictionResult = null,
    predictionError = null,
}: CourseRecommendationsProps) {

    // Track which AI course cards are expanded
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Analyzing your profile...</p>
            </div>
        );
    }

    const highlyRecommended      = courses.filter(c => c.category === 'highly-recommended');
    const moderatelyRecommended  = courses.filter(c => c.category === 'moderately-recommended');
    const conditionallyEligible  = courses.filter(c => c.category === 'conditionally-eligible');

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Found</h3>
                <p className="text-gray-600 max-w-md">
                    We couldn't find any matching courses for your stream. Please review your selections.
                </p>
            </div>
        );
    }

    // ── Rank badge colour ──────────────────────────────────────────────────────
    const rankColor = (i: number) =>
        i === 0 ? 'bg-green-500'
        : i === 1 ? 'bg-cyan-500'
        : i === 2 ? 'bg-blue-400'
        : 'bg-gray-400';

    const barColor = (i: number) =>
        i === 0 ? 'from-green-400 to-green-600'
        : i === 1 ? 'from-cyan-400 to-cyan-600'
        : i === 2 ? 'from-blue-400 to-blue-500'
        : 'from-gray-300 to-gray-400';

    // ── AI Results Section ─────────────────────────────────────────────────────
    const AISection = () => {
        if (predicting) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm"
                >
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>AI is analysing your profile and predicting top courses + universities...</span>
                </motion.div>
            );
        }

        if (predictionError) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
                >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>AI prediction unavailable: {predictionError}</span>
                </motion.div>
            );
        }

        if (!predictionResult) return null;

        const { results, input_summary } = predictionResult;

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 overflow-hidden"
            >
                {/* ── Header ── */}
                <div className="px-6 pt-6 pb-4 border-b border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                            AI Course & University Predictions
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Based on your academic profile and career interests
                    </p>

                    {/* Input summary pills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {[
                            { label: 'Stream',       value: input_summary.stream },
                            { label: 'Z-Score',      value: input_summary.z_score },
                            { label: 'Island Rank',  value: input_summary.island_rank },
                            { label: 'District',     value: input_summary.district },
                        ].map(({ label, value }) => (
                            <span key={label} className="text-xs bg-white border border-green-200 rounded-full px-3 py-1 text-gray-600">
                                <span className="font-semibold text-gray-800">{label}:</span> {value}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Course cards ── */}
                <div className="divide-y divide-green-100">
                    {results.map((item, idx) => (
                        <div key={item.course} className="bg-white/60 hover:bg-white/90 transition-colors">

                            {/* Course header row — always visible */}
                            <button
                                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                                className="w-full flex items-center gap-4 px-6 py-4 text-left"
                            >
                                {/* Rank */}
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${rankColor(idx)}`}>
                                    {item.rank}
                                </span>

                                {/* Course + university */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{item.course}</p>
                                    <p className="text-xs text-gray-500 truncate">{item.university} · {item.uni_code}</p>
                                </div>

                                {/* Score badge */}
                                <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 shrink-0">
                                    Score: {(item.course_score * 100).toFixed(1)}%
                                </span>

                                {/* Aptitude badge */}
                                {item.aptitude_required === 'Yes' && (
                                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 shrink-0">
                                        Aptitude
                                    </span>
                                )}

                                {/* Expand toggle */}
                                {expandedIndex === idx
                                    ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                                    : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                                }
                            </button>

                            {/* University predictions — expandable */}
                            <AnimatePresence>
                                {expandedIndex === idx && item.top_university_predictions.length > 0 && (
                                    <motion.div
                                        key="uni-list"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-5 space-y-2">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                                University Admission Chances
                                            </p>
                                            {item.top_university_predictions.map((pred, uIdx) => (
                                                <div key={pred.university} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${rankColor(uIdx)}`}>
                                                        {uIdx + 1}
                                                    </span>
                                                    <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                                                        {pred.university}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${pred.probability}%` }}
                                                                transition={{ duration: 0.5, delay: uIdx * 0.04 }}
                                                                className={`h-full rounded-full bg-gradient-to-r ${barColor(uIdx)}`}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700 w-12 text-right">
                                                            {pred.probability}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-gray-400 text-center py-3">
                    Tap a course to expand university admission probabilities
                </p>
            </motion.div>
        );
    };

    // ── Course card (existing rule-based recommendations) ─────────────────────
    const CourseCard = ({ course, category }: { course: RecommendedCourse; category: string }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4"
            style={{
                borderLeftColor:
                    category === 'highly-recommended' ? '#10b981'
                    : category === 'moderately-recommended' ? '#f59e0b'
                    : '#6b7280'
            }}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{course.courseName}</h3>
                        <p className="text-sm text-gray-600">{course.university}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                        category === 'highly-recommended' ? 'bg-green-500'
                        : category === 'moderately-recommended' ? 'bg-amber-500'
                        : 'bg-gray-500'
                    }`}>
                        {category === 'highly-recommended' ? '✓ Recommended'
                         : category === 'moderately-recommended' ? '◐ Moderate'
                         : '? Conditional'}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Academic</p>
                        <p className="text-lg font-bold text-cyan-600">{course.academicScore.toFixed(1)}/5</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Interest</p>
                        <p className="text-lg font-bold text-cyan-600">{course.interestScore.toFixed(1)}/5</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Overall</p>
                        <p className="text-lg font-bold text-cyan-600">{course.overallScore.toFixed(1)}/5</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(course.overallScore / 5) * 100}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                        />
                    </div>
                </div>

                {course.requiresAptitudeTest && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectCourse(course)}
                        className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <BookOpen className="w-4 h-4" />
                        {category === 'highly-recommended' ? 'Practice Aptitude Test' : 'View Aptitude Test'}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-12">

            {/* ── AI Section (top N courses + universities) ── */}
            <AISection />

            {/* ── Highly Recommended ── */}
            {highlyRecommended.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-green-500 rounded" />
                        <h2 className="text-2xl font-bold text-gray-900">Highly Recommended Courses</h2>
                        <span className="text-lg font-bold text-green-600">({highlyRecommended.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {highlyRecommended.map(course => (
                            <CourseCard key={course.uniCode} course={course} category="highly-recommended" />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Moderately Recommended ── */}
            {/* {moderatelyRecommended.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-amber-500 rounded" />
                        <h2 className="text-2xl font-bold text-gray-900">Moderately Recommended Courses</h2>
                        <span className="text-lg font-bold text-amber-600">({moderatelyRecommended.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {moderatelyRecommended.map(course => (
                            <CourseCard key={course.uniCode} course={course} category="moderately-recommended" />
                        ))}
                    </div>
                </div>
            )} */}

            {/* ── Conditionally Eligible ── */}
            {conditionallyEligible.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-gray-500 rounded" />
                        <h2 className="text-2xl font-bold text-gray-900">Conditionally Eligible Courses</h2>
                        <span className="text-lg font-bold text-gray-600">({conditionallyEligible.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {conditionallyEligible.map(course => (
                            <CourseCard key={course.uniCode} course={course} category="conditionally-eligible" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}