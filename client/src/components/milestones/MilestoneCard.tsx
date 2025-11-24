'use client';

import ConfirmModal from '@/components/common/ConfirmModal';
import { Milestone } from '@/utils/mockMilestones';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, Target, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MilestoneCardProps {
    milestone: Milestone;
    onDelete: (id: string) => void;
}

export default function MilestoneCard({ milestone, onDelete }: MilestoneCardProps) {
    const router = useRouter();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const progress = milestone.totalSteps > 0
        ? (milestone.completedSteps / milestone.totalSteps) * 100
        : 0;

    const handleView = () => {
        router.push(`/milestones?milestoneId=${milestone.id}`);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        onDelete(milestone.id);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
                <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />

                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Target className="w-6 h-6 text-purple-600" />
                                <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm">{milestone.description}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-semibold text-purple-600">
                                {milestone.completedSteps} / {milestone.totalSteps} steps
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600">{milestone.completedSteps} Completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                            <span className="text-gray-600">{milestone.totalSteps - milestone.completedSteps} Pending</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleView}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            <Eye className="w-4 h-4" />
                            View Steps
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Milestone"
                message={`Are you sure you want to delete "${milestone.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
}
