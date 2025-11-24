'use client';

import AppShell from '@/components/common/AppShell';
import {
    DiagramHeader,
    ExplanationSection,
    QuickNavigation,
    VisualRoadmap,
    ROADMAP_STEPS
} from '@/components/diagram';
import { clearMilestones, getMilestones, Milestone, saveMilestones } from '@/utils/milestoneStorage';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DiagramPage() {
    const router = useRouter();
    const [expandedStep, setExpandedStep] = useState<number | null>(null);
    const [generating, setGenerating] = useState(false);

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
        ROADMAP_STEPS.slice(0, 2).forEach((step, index) => {
            const milestone: Milestone = {
                id: `milestone-${step.id}-${Date.now()}-${index}`,
                title: step.title,
                description: step.description,
                goal: step.goal,
                duration: step.duration,
                actionPlan: step.actionPlan,
                resources: step.resources,
                successCriteria: step.successCriteria,
                status: 'pending',
                color: step.color,
                icon: step.icon.name
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

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <QuickNavigation
                        expandedStep={expandedStep}
                        scrollToStep={scrollToStep}
                    />
                    <DiagramHeader />
                    <VisualRoadmap
                        expandedStep={expandedStep}
                        toggleStep={toggleStep}
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
