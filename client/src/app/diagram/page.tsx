'use client';

import AppShell from '@/components/common/AppShell';
import {
    DiagramHeader,
    ExplanationSection,
    QuickNavigation,
    VisualRoadmap
} from '@/components/diagram';
import { motion } from 'framer-motion';
import { Rocket, Loader2, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import diagramService from '@/services/diagram.service';
import milestoneService from '@/services/milestone.service';
import { Roadmap, RoadmapStep } from '@/types/diagram.types';
import { CreateMilestoneRequest } from '@/types/milestone.types';

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
            console.log('Fetched roadmap data:', data);
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

    const handleGenerateMilestones = async () => {
        if (!roadmap) {
            alert('Roadmap data is not available');
            return;
        }

        try {
            setGenerating(true);

            // Validate required fields
            if (!roadmap._id) {
                throw new Error('Roadmap ID is missing');
            }
            if (!roadmap.profileId) {
                throw new Error('Profile ID is missing');
            }
            if (!roadmap.courseId) {
                throw new Error('Course ID is missing');
            }

            // Map roadmap steps to milestone stages format (all 6 stages)
            const stages = roadmapSteps.map((step) => ({
                stepId: step.id,
                stepTitle: step.title,
                stepGoal: step.goal,
                description: step.description,
                duration: step.duration,
                icon: step.icon || 'BookOpen',
                color: step.color || 'bg-purple-500',
                actionPlan: step.actionPlan || [],
                resources: step.resources?.map((r) => typeof r === 'string' ? r : r.title) || [],
                successCriteria: step.successCriteria || [],
            }));

            // Create milestone data
            const milestoneData: CreateMilestoneRequest = {
                profileId: roadmap.profileId,
                roadmapId: roadmap._id,
                courseId: roadmap.courseId,
                courseName: roadmap.courseName || 'Unknown Course',
                university: roadmap.university || 'Unknown University',
                careerGoal: roadmap.careerGoal || 'Unknown Career Goal',
                title: `Learn-to-Earn Career Pathway for ${roadmap.courseName || 'Your Course'}`,
                description: `Complete all stages to master ${roadmap.courseName || 'this course'} and achieve your goal of becoming a ${roadmap.careerGoal || 'professional'}`,
                stages,
            };

            console.log('Creating milestone with data:', milestoneData);

            // Create milestone using API
            const createdMilestone = await milestoneService.createMilestone(milestoneData);

            console.log('Milestone created successfully:', createdMilestone);
            console.log('Full milestone object:', JSON.stringify(createdMilestone, null, 2));

            // Check for _id in different possible locations
            const milestoneId = createdMilestone?._id;
            
            console.log('Milestone ID:', milestoneId);

            if (!milestoneId) {
                console.error('Response structure issue. Expected _id field not found.');
                throw new Error('Milestone created but ID is missing from response');
            }

            // Navigate to milestone page with milestone ID
            console.log('Navigating to:', `/milestones?milestoneId=${milestoneId}`);
            router.push(`/milestones?milestoneId=${milestoneId}`);
        } catch (error: any) {
            console.error('Error creating milestone:', error);
            alert(error.message || 'Failed to create milestone. Please try again.');
            setGenerating(false);
        }
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
                            Create a personalized milestones based on this roadmap
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
