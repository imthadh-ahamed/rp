'use client';

import MilestoneCard from '@/components/milestones/MilestoneCard';
import milestoneService from '@/services/milestone.service';
import { Milestone } from '@/types/milestone.types';
import { motion } from 'framer-motion';
import { Loader2, Plus, Target } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function MilestonesTab() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMilestones = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await milestoneService.getAllMilestones();
            setMilestones(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load milestones');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMilestones();
    }, [fetchMilestones]);

    const handleDelete = async (id: string) => {
        try {
            await milestoneService.deleteMilestone(id);
            setMilestones(prev => prev.filter(m => m._id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to delete milestone');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-3 text-gray-500 text-lg">Loading milestones...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <button
                    onClick={fetchMilestones}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            {milestones.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {milestones.map((milestone) => (
                        <MilestoneCard
                            key={milestone._id}
                            milestone={milestone}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
                >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <Target className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Milestones Yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Generate milestones from your learning roadmap to start tracking your progress.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/diagram"
                            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Go to Roadmap
                        </Link>
                        <Link
                            href="/career-guide"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Milestone
                        </Link>
                    </div>
                </motion.div>
            )}
        </>
    );
}
