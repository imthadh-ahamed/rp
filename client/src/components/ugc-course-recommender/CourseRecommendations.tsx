'use client';

import { motion } from 'framer-motion';
import { BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { Course } from '@/utils/recommendationEngine';

interface CourseRecommendationsProps {
    courses: Course[];
    onSelectCourse: (course: Course) => void;
    isLoading?: boolean;
}

export default function CourseRecommendations({ courses, onSelectCourse, isLoading = false }: CourseRecommendationsProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Analyzing your profile and generating recommendations...</p>
            </div>
        );
    }

    const highlyRecommended = courses.filter(c => c.category === 'highly-recommended');
    const moderatelyRecommended = courses.filter(c => c.category === 'moderately-recommended');
    const conditionallyEligible = courses.filter(c => c.category === 'conditionally-eligible');

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

    const CourseCard = ({ course, category }: { course: Course; category: string }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4"
            style={{
                borderLeftColor: category === 'highly-recommended' ? '#10b981' : category === 'moderately-recommended' ? '#f59e0b' : '#6b7280'
            }}
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.university}</p>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                            category === 'highly-recommended'
                                ? 'bg-green-500'
                                : category === 'moderately-recommended'
                                ? 'bg-amber-500'
                                : 'bg-gray-500'
                        }`}
                    >
                        {category === 'highly-recommended' ? '✓ Recommended' : category === 'moderately-recommended' ? '◐ Moderate' : '? Conditional'}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                {/* Scores */}
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

                {/* Progress Bar */}
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

                {/* Aptitude Test Button */}
                {course.hasAptitudeTest && (
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
            {/* Highly Recommended */}
            {highlyRecommended.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-green-500 rounded"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Highly Recommended Courses</h2>
                        <span className="text-lg font-bold text-green-600">({highlyRecommended.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {highlyRecommended.map(course => (
                            <CourseCard key={course.id} course={course} category="highly-recommended" />
                        ))}
                    </div>
                </div>
            )}

            {/* Moderately Recommended */}
            {moderatelyRecommended.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-amber-500 rounded"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Moderately Recommended Courses</h2>
                        <span className="text-lg font-bold text-amber-600">({moderatelyRecommended.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {moderatelyRecommended.map(course => (
                            <CourseCard key={course.id} course={course} category="moderately-recommended" />
                        ))}
                    </div>
                </div>
            )}

            {/* Conditionally Eligible */}
            {conditionallyEligible.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-gray-500 rounded"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Conditionally Eligible Courses</h2>
                        <span className="text-lg font-bold text-gray-600">({conditionallyEligible.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {conditionallyEligible.map(course => (
                            <CourseCard key={course.id} course={course} category="conditionally-eligible" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
