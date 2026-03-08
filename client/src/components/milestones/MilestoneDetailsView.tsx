'use client';

import FeedbackModal from '@/components/milestones/FeedbackModal';
import CelebrationModal from '@/components/milestones/CelebrationModal';
import milestoneService from '@/services/milestone.service';
import { Milestone, StageCompletion } from '@/types/milestone.types';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, Edit3, Flag, Library, ListTodo, Target, Trophy, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MilestoneDetailsViewProps {
    milestoneId: string;
    onBack: () => void;
}

export default function MilestoneDetailsView({ milestoneId, onBack }: MilestoneDetailsViewProps) {
    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStage, setSelectedStage] = useState<StageCompletion | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        fetchMilestone();
    }, [milestoneId]);

    // Check if all stages are completed and show celebration
    useEffect(() => {
        if (milestone && milestone.overallStatus === 'completed' && milestone.completedStages === milestone.stages.length) {
            // Delay celebration slightly to allow UI to update
            const timer = setTimeout(() => {
                setShowCelebration(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [milestone]);

    const fetchMilestone = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await milestoneService.getMilestoneById(milestoneId);
            setMilestone(data);
        } catch (err: any) {
            console.error('Error fetching milestone:', err);
            setError(err.message || 'Failed to load milestone');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartStage = async (stepId: number) => {
        if (!milestone) return;
        
        try {
            const updatedMilestone = await milestoneService.startStage(milestone._id, { stepId });
            setMilestone(updatedMilestone);
        } catch (err: any) {
            console.error('Error starting stage:', err);
            alert(err.message || 'Failed to start stage');
        }
    };

    const handleCompleteStage = (stepId: number) => {
        const stage = milestone?.stages.find(s => s.stepId === stepId);
        if (stage && stage.status !== 'completed') {
            setSelectedStage(stage);
            setShowFeedbackModal(true);
        }
    };

    const handleSubmitFeedback = async (feedback: string) => {
        if (milestone && selectedStage) {
            try {
                const updatedMilestone = await milestoneService.completeStage(milestone._id, {
                    stepId: selectedStage.stepId,
                    feedback
                });
                setMilestone(updatedMilestone);
                setShowFeedbackModal(false);
                setSelectedStage(null);
            } catch (err: any) {
                console.error('Error completing stage:', err);
                alert(err.message || 'Failed to complete stage');
            }
        }
    };

    const handleEditFeedback = (stage: StageCompletion) => {
        setSelectedStage(stage);
        setShowFeedbackModal(true);
    };

    const handleUpdateFeedback = async (feedback: string) => {
        if (milestone && selectedStage) {
            try {
                const updatedMilestone = await milestoneService.updateStageFeedback(milestone._id, {
                    stepId: selectedStage.stepId,
                    feedback
                });
                setMilestone(updatedMilestone);
                setShowFeedbackModal(false);
                setSelectedStage(null);
            } catch (err: any) {
                console.error('Error updating feedback:', err);
                alert(err.message || 'Failed to update feedback');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading milestone details...</p>
            </div>
        );
    }

    if (error || !milestone) {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Milestone</h2>
                <p className="text-gray-600 mb-6">{error || 'Milestone not found'}</p>
                <button
                    onClick={onBack}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                    Back to Milestones
                </button>
            </div>
        );
    }

    const progress = milestone.progressPercentage || 0;

    return (
        <>
            <button
                onClick={onBack}
                className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-8 group"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Milestones</span>
            </button>

            {/* Milestone Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
            >
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="w-8 h-8 text-purple-600" />
                            <h1 className="text-3xl font-bold text-gray-900">{milestone.title}</h1>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">{milestone.description}</p>

                        {/* Progress Bar */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                                <span className="text-sm font-semibold text-purple-600">
                                    {milestone.completedStages} / {milestone.stages.length} stages ({Math.round(progress)}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Course</p>
                        <p className="font-semibold text-gray-900">{milestone.courseName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">University</p>
                        <p className="font-semibold text-gray-900">{milestone.university}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Career Goal</p>
                        <p className="font-semibold text-gray-900">{milestone.careerGoal}</p>
                    </div>
                </div>
            </motion.div>

            {/* Stages */}
            <div className="space-y-6">
                {milestone.stages.map((stage, index) => {
                    const isCompleted = stage.status === 'completed';
                    const isInProgress = stage.status === 'in_progress';
                    const isPending = stage.status === 'pending';
                    
                    return (
                        <motion.div
                            key={stage.stepId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-2xl shadow-lg border ${isCompleted ? 'border-green-200' : isInProgress ? 'border-purple-200' : 'border-gray-100'} overflow-hidden`}
                        >
                            <div className={`h-2 ${stage.color}`} />

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-bold text-gray-500">Stage {stage.stepId}</span>
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${stage.color} text-white text-sm font-bold shadow-sm`}>
                                                <Flag className="w-4 h-4" />
                                                {stage.stepGoal}
                                            </div>
                                            {isCompleted && (
                                                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Completed
                                                </div>
                                            )}
                                            {isInProgress && (
                                                <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                                    <Clock className="w-4 h-4" />
                                                    In Progress
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{stage.stepTitle}</h2>
                                        <p className="text-gray-600">{stage.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-500 mb-6">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">{stage.duration}</span>
                                    {stage.completedAt && (
                                        <span className="ml-4 text-green-600 font-medium">
                                            Completed on {new Date(stage.completedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                    {stage.startedAt && !isCompleted && (
                                        <span className="ml-4 text-purple-600 font-medium">
                                            Started on {new Date(stage.startedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>

                                {/* Sticky Note Feedback (if completed) */}
                                {isCompleted && stage.feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={() => handleEditFeedback(stage)}
                                        className="mb-6 cursor-pointer group"
                                    >
                                        <div className="relative bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-yellow-400">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                                    📝 My Experience
                                                </h4>
                                                <Edit3 className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all">
                                                {stage.feedback}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                                📅 {new Date(stage.completedAt!).toLocaleDateString()}
                                                <span className="ml-2 text-xs text-gray-500 italic">(Click to edit)</span>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Expandable Details */}
                                <details className="group">
                                    <summary className="cursor-pointer list-none flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 mb-4">
                                        <span>View Details</span>
                                        <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>

                                    <div className="space-y-4 mt-4">
                                        {/* Action Plan */}
                                        {stage.actionPlan && stage.actionPlan.length > 0 && (
                                            <div className="bg-purple-50 rounded-xl p-4">
                                                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                                    <ListTodo className="w-5 h-5 text-purple-600" />
                                                    Action Plan
                                                </h3>
                                                <ul className="space-y-2">
                                                    {stage.actionPlan.map((action, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                        <div className={`w-2 h-2 rounded-full ${stage.color} mt-1.5 flex-shrink-0`} />
                                                        {action}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        )}

                                        {/* Resources & Success Criteria */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {stage.resources && stage.resources.length > 0 && (
                                                <div className="bg-blue-50 rounded-xl p-4">
                                                    <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                                        <Library className="w-5 h-5 text-blue-600" />
                                                        Resources
                                                    </h3>
                                                    <ul className="space-y-1">
                                                        {stage.resources.map((resource, i) => (
                                                            <li key={i} className="text-gray-700 text-sm">
                                                                • {resource}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {stage.successCriteria && stage.successCriteria.length > 0 && (
                                                <div className="bg-yellow-50 rounded-xl p-4">
                                                    <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                                        <Trophy className="w-5 h-5 text-yellow-600" />
                                                        Success Criteria
                                                    </h3>
                                                    <ul className="space-y-1">
                                                        {stage.successCriteria.map((criteria, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                                {criteria}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </details>

                                {/* Action Buttons */}
                                <div className="mt-4 flex gap-3">
                                    {isPending && (
                                        <motion.button
                                            onClick={() => handleStartStage(stage.stepId)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                                        >
                                            Start Stage
                                        </motion.button>
                                    )}
                                    {isInProgress && (
                                        <motion.button
                                            onClick={() => handleCompleteStage(stage.stepId)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                                        >
                                            Mark Stage as Complete
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {selectedStage && (
                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => {
                        setShowFeedbackModal(false);
                        setSelectedStage(null);
                    }}
                    onSubmit={selectedStage.status === 'completed' ? handleUpdateFeedback : handleSubmitFeedback}
                    milestoneTitle={selectedStage.stepTitle}
                    initialFeedback={selectedStage.feedback || undefined}
                />
            )}

            {/* Celebration Modal */}
            <CelebrationModal
                isOpen={showCelebration}
                onClose={() => setShowCelebration(false)}
                completedStages={milestone?.completedStages || 0}
                totalStages={milestone?.stages.length || 0}
                careerGoal={milestone?.careerGoal || ''}
                onViewAllMilestones={() => {
                    setShowCelebration(false);
                    onBack();
                }}
            />
        </>
    );
}
