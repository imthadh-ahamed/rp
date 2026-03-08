/**
 * Stage completion status type
 */
export type StageStatus = 'pending' | 'in_progress' | 'completed';

/**
 * Overall milestone status type
 */
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed';

/**
 * Stage completion interface
 */
export interface StageCompletion {
    stepId: number;
    stepTitle: string;
    stepGoal: string;
    description: string;
    duration: string;
    icon: string;
    color: string;
    actionPlan: string[];
    resources: string[];
    successCriteria: string[];
    status: StageStatus;
    feedback?: string | null;
    completedAt?: string | null;
    startedAt?: string | null;
}

/**
 * Milestone interface
 */
export interface Milestone {
    _id: string;
    userId: string;
    profileId: string;
    roadmapId: string;
    courseId: string;
    courseName: string;
    university: string;
    careerGoal: string;
    title: string;
    description: string;
    stages: StageCompletion[];
    overallStatus: MilestoneStatus;
    progressPercentage: number;
    completedStages: number;
    metadata?: Record<string, any>;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Create milestone request
 */
export interface CreateMilestoneRequest {
    profileId: string;
    roadmapId: string;
    courseId: string;
    courseName: string;
    university: string;
    careerGoal: string;
    title?: string;
    description?: string;
    stages: {
        stepId: number;
        stepTitle: string;
        stepGoal: string;
        description: string;
        duration: string;
        icon?: string;
        color?: string;
        actionPlan?: string[];
        resources?: string[];
        successCriteria?: string[];
    }[];
}

/**
 * Update milestone request
 */
export interface UpdateMilestoneRequest {
    overallStatus?: MilestoneStatus;
    title?: string;
    description?: string;
}

/**
 * Start stage request
 */
export interface StartStageRequest {
    stepId: number;
}

/**
 * Complete stage request
 */
export interface CompleteStageRequest {
    stepId: number;
    feedback?: string;
}

/**
 * Update stage feedback request
 */
export interface UpdateStageFeedbackRequest {
    stepId: number;
    feedback: string;
}

/**
 * Progress data interface
 */
export interface MilestoneProgress {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    percentage: number;
    stages: StageCompletion[];
}

/**
 * Detailed analytics interface
 */
export interface MilestoneAnalytics {
    totalMilestones: number;
    completedMilestones: number;
    inProgressMilestones: number;
    totalStages: number;
    completedStages: number;
    averageProgress: number;
    milestones: {
        roadmapId: string;
        courseName: string;
        careerGoal: string;
        progressPercentage: number;
        completedStages: number;
        overallStatus: MilestoneStatus;
    }[];
}

/**
 * API Response wrapper for single milestone
 */
export interface MilestoneResponse {
    success: boolean;
    message: string;
    data: {
        milestone: Milestone;
    };
}

/**
 * API Response wrapper for multiple milestones
 */
export interface MilestonesResponse {
    success: boolean;
    message: string;
    data: {
        milestones: Milestone[];
    };
}

/**
 * API Response wrapper for progress
 */
export interface ProgressResponse {
    success: boolean;
    message: string;
    data: MilestoneProgress;
}

/**
 * API Response wrapper for analytics
 */
export interface AnalyticsResponse {
    success: boolean;
    message: string;
    data: MilestoneAnalytics;
}
