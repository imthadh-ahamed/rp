/**
 * Diagram/Roadmap Types
 * Type definitions for roadmap generation and management
 */

export interface RoadmapResource {
    title: string;
    url: string;
}

export interface RoadmapStep {
    id: number;
    title: string;
    goal: string;
    icon: string;
    duration: string;
    description: string;
    actionPlan: string[];
    resources: RoadmapResource[];
    successCriteria: string[];
    color?: string;
    lightColor?: string;
    textColor?: string;
}

export interface RoadmapMetadata {
    curriculum_focus: string;
    languages: string[];
    duration_years: number;
    skill_gaps_count: number;
    gap_severity: "low" | "medium" | "high";
    priority_skills: string[];
}

export interface Roadmap {
    _id: string;
    userId: string;
    profileId: string;
    courseId: string;
    courseName: string;
    university: string;
    careerGoal: string;
    status: "success" | "error";
    roadmap: RoadmapStep[];
    metadata: RoadmapMetadata;
    warnings: string[];
    errors: string[];
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GenerateRoadmapRequest {
    profileId: string;
    courseId: string; // Rank number from recommendations array
}

export interface RoadmapResponse {
    success: boolean;
    message: string;
    data: {
        roadmap: Roadmap;
    };
}

export interface RoadmapsResponse {
    success: boolean;
    message: string;
    data: {
        roadmaps: Roadmap[];
    };
}