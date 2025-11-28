'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (feedback: string) => void;
    milestoneTitle: string;
    initialFeedback?: string;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, milestoneTitle, initialFeedback = '' }: FeedbackModalProps) {
    const [feedback, setFeedback] = useState(initialFeedback);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback.trim()) {
            onSubmit(feedback);
            if (!initialFeedback) {
                setFeedback('');
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {initialFeedback ? 'Edit Your Experience' : 'Congratulations! 🎉'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {initialFeedback
                                ? `Update your feedback for ${milestoneTitle}`
                                : `You're about to complete ${milestoneTitle}`
                            }
                        </p>

                        <form onSubmit={handleSubmit}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Share your experience <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={5}
                                required
                                placeholder="Describe what you learned, challenges faced, and key achievements..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            />

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    {initialFeedback ? 'Update' : 'Complete Step'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
