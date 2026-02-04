'use client';

import { motion } from 'framer-motion';
import { CheckCircle, X, Clock, BookOpen, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Recommendation } from '@/types/profile.types';
import diagramService from '@/services/diagram.service';
import { useState } from 'react';

interface CourseSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Recommendation | null;
    profileId: string;
}

export default function CourseSelectionModal({ isOpen, onClose, course, profileId }: CourseSelectionModalProps) {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !course) return null;

    const handleConfirmSelection = async () => {
        if (!profileId) {
            setError('Profile ID is missing. Please try again.');
            return;
        }

        try {
            setIsGenerating(true);
            setError(null);

            // Use course rank as courseId (convert to string)
            const courseId = course.rank.toString();

            // Generate or get existing roadmap
            const roadmap = await diagramService.getOrGenerateRoadmap(profileId, courseId);

            // Navigate to diagram page with roadmap ID
            router.push(`/diagram?id=${roadmap._id}`);
            onClose();
        } catch (err: any) {
            console.error('Error generating roadmap:', err);
            setError(err.message || 'Failed to generate roadmap. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-purple-600" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Confirm Course Selection
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to select this course?
                    </p>

                    <div className="w-full bg-purple-50 rounded-lg p-4 mb-6 text-left">
                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">
                            {course.course_name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                            {course.university}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {course.study_method}
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            disabled={isGenerating}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmSelection}
                            disabled={isGenerating}
                            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating Roadmap...
                                </>
                            ) : (
                                'Confirm Selection'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
