'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Star, Calendar, DollarSign, BookOpen, Loader2, Sparkles, GraduationCap, Languages, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Recommendation } from '@/types/profile.types';

interface CourseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Recommendation | null;
}

export default function CourseDetailModal({ isOpen, onClose, course }: CourseDetailModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || !course) return null;

    const handleGenerateDiagram = async () => {
        setIsLoading(true);
        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push(`/diagram?courseId=${course.id}`);
        setIsLoading(false);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header Banner */}
                    <div className="relative h-48 shrink-0 bg-gradient-to-r from-purple-700 to-blue-700">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                {course.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium border border-white/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{course.course_name}</h2>
                            <p className="text-lg text-purple-100 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                {course.university}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        {/* Key Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="flex items-center gap-2 mb-1 text-purple-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">Duration</span>
                                </div>
                                <p className="font-semibold text-gray-900">{course.duration}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 mb-1 text-blue-600">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">Method</span>
                                </div>
                                <p className="font-semibold text-gray-900">{course.study_method}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <div className="flex items-center gap-2 mb-1 text-green-600">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">Fees</span>
                                </div>
                                <p className="font-semibold text-gray-900">
                                    {course.course_fee === 'None' || !course.course_fee ? 'Not Available' : course.course_fee}
                                </p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                <div className="flex items-center gap-2 mb-1 text-yellow-600">
                                    <Star className="w-4 h-4 fill-yellow-600" />
                                    <span className="text-xs font-bold uppercase">Match</span>
                                </div>
                                <p className="font-semibold text-gray-900">{course.match_score.toFixed(1)}%</p>
                            </div>
                        </div>

                        <div className="space-y-8 text-gray-600">
                            {/* Overview */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    AI Explanation
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 leading-relaxed">
                                    {course.explanation}
                                </div>
                            </div>

                            {/* Requirements */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                    Admission Requirements
                                </h3>
                                <p className="leading-relaxed whitespace-pre-line">
                                    {course.requirements}
                                </p>
                            </div>

                            {/* Career Opportunities */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <BriefcaseIcon className="w-5 h-5 text-purple-600" />
                                    Career Opportunities
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {course.career_opportunities.split(',').map((career, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                            {career.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <Languages className="w-4 h-4 text-gray-500" />
                                        Study Language
                                    </h4>
                                    <p>{course.study_language}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        Location
                                    </h4>
                                    <p>{course.location !== 'Unknown' ? course.location : 'Contact University'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-8 pt-8 border-t flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            <a
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                            >
                                Visit Website
                            </a>
                            <button
                                onClick={handleGenerateDiagram}
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        View Pathway
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function BriefcaseIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    )
}
