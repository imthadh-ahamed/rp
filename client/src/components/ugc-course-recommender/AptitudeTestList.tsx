'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { RecommendedCourse } from '@/utils/recommendationEngine';

interface AptitudeTestListProps {
    course: RecommendedCourse;
    onSelectTest: (testName: string) => void;
    onBack: () => void;
}

export default function AptitudeTestList({ course, onSelectTest, onBack }: AptitudeTestListProps) {
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
                    ← Back to Recommendations
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Aptitude Test Practice</h2>
                <p className="text-gray-600">
                    Practice aptitude tests for courses that require them. These mock tests will help you prepare for the actual examination.
                </p>
            </div>

            {/* Course Info */}
            <div className="mb-8 p-6 bg-cyan-50 rounded-lg border border-cyan-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.courseName}</h3>
                <p className="text-gray-600">{course.university}</p>
            </div>

            {/* Test List */}
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
                                    <p className="text-sm text-gray-600">Mock Test · Timed Assessment</p>
                                </div>
                            </div>
                            <span className="text-cyan-600 font-bold group-hover:translate-x-2 transition-transform">→</span>
                        </motion.button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No aptitude tests available for this course.</p>
                </div>
            )}
        </motion.div>
    );
}
