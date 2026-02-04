'use client';

import AppShell from '@/components/common/AppShell';
import {
    DiagramHeader,
    ExplanationSection,
    QuickNavigation,
    VisualRoadmap
} from '@/components/diagram';
import { clearMilestones, getMilestones, Milestone, saveMilestones } from '@/utils/milestoneStorage';
import { motion } from 'framer-motion';
import { Rocket, Loader2, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import diagramService from '@/services/diagram.service';
import { Roadmap, RoadmapStep } from '@/types/diagram.types';

function DiagramContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roadmapId = searchParams.get('id');
    
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedStep, setExpandedStep] = useState<number | null>(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (roadmapId) {
            fetchRoadmap();
        } else {
            setError('No roadmap ID provided');
            setIsLoading(false);
        }
    }, [roadmapId]);

    const fetchRoadmap = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await diagramService.getRoadmapById(roadmapId!);
            setRoadmap(data);
            setRoadmapSteps(data.roadmap || []);
        } catch (err: any) {
            console.error('Error fetching roadmap:', err);
            setError(err.message || 'Failed to load roadmap');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStep = (id: number) => {
        setExpandedStep(expandedStep === id ? null : id);
    };

    const scrollToStep = (id: number) => {
        const element = document.getElementById(`step-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleGenerateMilestones = () => {
        setGenerating(true);

        // Check if milestones already exist
        const existing = getMilestones();
        if (existing.length > 0) {
            if (!confirm('You already have milestones. Do you want to replace them with new ones?')) {
                setGenerating(false);
                return;
            }
            // Clear existing milestones before creating new ones
            clearMilestones();
        }

        // Generate only the first 2 milestones from roadmap steps
        const newMilestones: Milestone[] = [];
        roadmapSteps.slice(0, 2).forEach((step, index) => {
            const milestone: Milestone = {
                id: `milestone-${step.id}-${Date.now()}-${index}`,
                title: step.title,
                description: step.description,
                goal: step.goal,
                duration: step.duration,
                actionPlan: step.actionPlan,
                resources: step.resources.map((r) => r.title),
                successCriteria: step.successCriteria,
                status: 'pending',
                color: step.color || 'bg-purple-500',
                icon: step.icon
            };
            newMilestones.push(milestone);
        });

        // Save all milestones at once
        saveMilestones(newMilestones);

        setTimeout(() => {
            setGenerating(false);
            router.push('/milestones');
        }, 1000);
    };

    if (isLoading) {
        return (
            <AppShell>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Loading your personalized roadmap...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (error || !roadmap) {
        return (
            <AppShell>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Failed to Load Roadmap</h3>
                        <p className="text-gray-600 mb-6">{error || 'Roadmap not found'}</p>
                        <button
                            onClick={() => router.push('/milestones?tab=courses')}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            Back to Courses
                        </button>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <QuickNavigation
                        expandedStep={expandedStep}
                        scrollToStep={scrollToStep}
                        roadmapSteps={roadmapSteps}
                    />
                    <DiagramHeader roadmap={roadmap} />
                    <VisualRoadmap
                        expandedStep={expandedStep}
                        toggleStep={toggleStep}
                        roadmapSteps={roadmapSteps}
                    />

                    {/* Generate Milestones Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 text-center"
                    >
                        <motion.button
                            onClick={handleGenerateMilestones}
                            disabled={generating}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Rocket className={`w-6 h-6 ${generating ? 'animate-pulse' : ''}`} />
                            {generating ? 'Generating Milestones...' : 'Generate My Milestones'}
                        </motion.button>
                        <p className="text-gray-500 text-sm mt-3">
                            Create 2 personalized milestones based on this roadmap
                        </p>
                    </motion.div>

                    <ExplanationSection />
                </div>
            </div>
        </AppShell>
    );
}

export default function DiagramPage() {
    return (
        <Suspense fallback={
            <AppShell>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
            </AppShell>
        }>
            <DiagramContent />
        </Suspense>
    );
}
