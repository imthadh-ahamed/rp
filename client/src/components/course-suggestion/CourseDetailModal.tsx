'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Star, Calendar, DollarSign, BookOpen, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Course {
    id: number;
    title: string;
    institution: string;
    duration: string;
    location: string;
    rating: number;
    image: string;
    tags: string[];
}

interface CourseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course | null;
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

                    {/* Header Image */}
                    <div className="relative h-64 shrink-0">
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                {course.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
                            <p className="text-lg text-gray-200">{course.institution}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl text-purple-900">
                                <Clock className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-xs text-purple-600 font-medium uppercase">Duration</p>
                                    <p className="font-semibold">{course.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl text-blue-900">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-xs text-blue-600 font-medium uppercase">Location</p>
                                    <p className="font-semibold">{course.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl text-yellow-900">
                                <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                                <div>
                                    <p className="text-xs text-yellow-600 font-medium uppercase">Rating</p>
                                    <p className="font-semibold">{course.rating}/5.0</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 text-gray-600">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-purple-600" />
                                    Course Overview
                                </h3>
                                <p className="leading-relaxed">
                                    This comprehensive program is designed to provide students with a strong foundation in {course.title.toLowerCase()}.
                                    Through a blend of theoretical knowledge and practical application, you will develop the skills necessary to excel in the industry.
                                    The curriculum is regularly updated to reflect the latest trends and technologies.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    Key Modules
                                </h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {['Fundamentals & Theory', 'Practical Applications', 'Industry Projects', 'Professional Development', 'Advanced Specialization', 'Research Methods'].map((module, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                            {module}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-purple-600" />
                                    Career Opportunities
                                </h3>
                                <p className="leading-relaxed">
                                    Graduates of this program are highly sought after by top employers. Potential career paths include roles in
                                    multinational corporations, startups, government agencies, and research institutions.
                                </p>
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
                            <button
                                onClick={handleGenerateDiagram}
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Pathway...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate Diagram
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
