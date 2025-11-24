import { ROADMAP_STEPS } from '@/components/diagram/constants';

export interface MilestoneStep {
    id: string;
    title: string;
    description: string;
    goal: string;
    duration: string;
    actionPlan: string[];
    resources: string[];
    successCriteria: string[];
    status: 'pending' | 'completed';
    feedback?: string;
    completedAt?: string;
    color: string;
    icon: string;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    totalSteps: number;
    completedSteps: number;
    steps: MilestoneStep[];
}

// Create one milestone containing all roadmap steps
export const MOCK_MILESTONES: Milestone[] = [
    {
        id: 'milestone-learn-to-earn',
        title: 'Learn-to-Earn Career Pathway',
        description: 'Complete all stages of your personalized learning journey to achieve your career goals.',
        totalSteps: ROADMAP_STEPS.length,
        completedSteps: 0,
        steps: ROADMAP_STEPS.map((step) => ({
            id: `step-${step.id}`,
            title: step.title,
            description: step.description,
            goal: step.goal,
            duration: step.duration,
            actionPlan: step.actionPlan,
            resources: step.resources,
            successCriteria: step.successCriteria,
            status: 'pending' as const,
            color: step.color,
            icon: step.icon.name
        }))
    }
];
