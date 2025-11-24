'use client';

import AppShell from '@/components/common/AppShell';
import FeedbackModal from '@/components/milestones/FeedbackModal';
import { MOCK_MILESTONES, Milestone, MilestoneStep } from '@/utils/mockMilestones';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, Flag, Library, ListTodo, Target, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function MilestoneContent() {
    const searchParams = useSearchParams();
    const milestoneId = searchParams.get('milestoneId');

    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [selectedStep, setSelectedStep] = useState<MilestoneStep | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    useEffect(() => {
        if (milestoneId) {
            const found = MOCK_MILESTONES.find(m => m.id === milestoneId);
            setMilestone(found || null);
        }
    }, [milestoneId]);

    const handleCompleteStep = (stepId: string) => {
        const step = milestone?.steps.find(s => s.id === stepId);
        if (step && step.status === 'pending') {
            setSelectedStep(step);
            setShowFeedbackModal(true);
        }
    };

    const handleSubmitFeedback = (feedback: string) => {
        if (milestone && selectedStep) {
            const updatedSteps = milestone.steps.map(step =>
                step.id === selectedStep.id
                    ? { ...step, status: 'completed' as const, feedback, completedAt: new Date().toISOString() }
                    : step
            );
            const completedCount = updatedSteps.filter(s => s.status === 'completed').length;
            setMilestone({
                ...milestone,
                steps: updatedSteps,
                completedSteps: completedCount
            });
            setShowFeedbackModal(false);
            setSelectedStep(null);
        }
    };

    if (!milestone) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Milestone Not Found</h2>
                    <Link
                        href="/milestones"
                        className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                        Go back to Milestones
                    </Link>
                </div>
            </div>
        );
    }

    const progress = milestone.totalSteps > 0
        ? (milestone.completedSteps / milestone.totalSteps) * 100
        : 0;

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href="/milestones"
                        className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Milestones</span>
                    </Link>

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
                                            {milestone.completedSteps} / {milestone.totalSteps} steps ({Math.round(progress)}%)
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
                    </motion.div>

                    {/* Steps */}
                    <div className="space-y-6">
                        {milestone.steps.map((step, index) => {
                            const isCompleted = step.status === 'completed';
                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white rounded-2xl shadow-lg border ${isCompleted ? 'border-green-200' : 'border-gray-100'} overflow-hidden`}
                                >
                                    <div className={`h-2 ${step.color}`} />

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-bold text-gray-500">Step {index + 1}</span>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${step.color.replace('bg-', 'bg-').replace('-500', '-50')} text-sm font-semibold`}>
                                                        <Flag className="w-4 h-4" />
                                                        {step.goal}
                                                    </div>
                                                    {isCompleted && (
                                                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Completed
                                                        </div>
                                                    )}
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
                                                <p className="text-gray-600">{step.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-500 mb-6">
                                            <Clock className="w-4 h-4" />
                                            <span className="font-medium">{step.duration}</span>
                                        </div>

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
                                                <div className="bg-purple-50 rounded-xl p-4">
                                                    <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                                        <ListTodo className="w-5 h-5 text-purple-600" />
                                                        Action Plan
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {step.actionPlan.map((action, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                                <div className={`w-2 h-2 rounded-full ${step.color} mt-1.5 flex-shrink-0`} />
                                                                {action}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Resources & Success Criteria */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-blue-50 rounded-xl p-4">
                                                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                                            <Library className="w-5 h-5 text-blue-600" />
                                                            Resources
                                                        </h3>
                                                        <ul className="space-y-1">
                                                            {step.resources.map((resource, i) => (
                                                                <li key={i} className="text-gray-700 text-sm">
                                                                    • {resource}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="bg-yellow-50 rounded-xl p-4">
                                                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                                                            <Trophy className="w-5 h-5 text-yellow-600" />
                                                            Success Criteria
                                                        </h3>
                                                        <ul className="space-y-1">
                                                            {step.successCriteria.map((criteria, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                                    {criteria}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Feedback (if completed) */}
                                                {isCompleted && step.feedback && (
                                                    <div className="bg-green-50 rounded-xl p-4">
                                                        <h3 className="font-bold text-gray-800 mb-2">Your Feedback</h3>
                                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{step.feedback}</p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            Completed on {new Date(step.completedAt!).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </details>

                                        {/* Action Button */}
                                        {!isCompleted && (
                                            <div className="mt-4">
                                                <motion.button
                                                    onClick={() => handleCompleteStep(step.id)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                                                >
                                                    Mark Step as Complete
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedStep && (
                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => {
                        setShowFeedbackModal(false);
                        setSelectedStep(null);
                    }}
                    onSubmit={handleSubmitFeedback}
                    milestoneTitle={selectedStep.title}
                />
            )}
        </AppShell>
    );
}

export default function MilestonePage() {
    return (
        <Suspense fallback={
            <AppShell>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-gray-600">Loading...</div>
                </div>
            </AppShell>
        }>
            <MilestoneContent />
        </Suspense>
    );
}
