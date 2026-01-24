'use client';

import { motion } from 'framer-motion';
import { CheckCircle, X, Clock, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Recommendation } from '@/types/profile.types';

interface CourseSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Recommendation | null;
}

export default function CourseSelectionModal({ isOpen, onClose, course }: CourseSelectionModalProps) {
    const router = useRouter();

    if (!isOpen || !course) return null;

    const handleConfirmSelection = () => {
        const courseId = course.id || course._id;
        if (courseId) {
            router.push(`/diagram?courseId=${courseId}`);
        }
        onClose();
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

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmSelection}
                            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg"
                        >
                            Confirm Selection
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
