import axiosInstance from "./http-service";
import {
    Milestone,
    CreateMilestoneRequest,
    UpdateMilestoneRequest,
    StartStageRequest,
    CompleteStageRequest,
    UpdateStageFeedbackRequest,
    MilestoneProgress,
    MilestoneAnalytics,
    MilestoneResponse,
    MilestonesResponse,
    ProgressResponse,
    AnalyticsResponse,
} from "@/types/milestone.types";

/**
 * Milestone Service Class
 */
class MilestoneService {
    /**
     * Create a new milestone from roadmap
     * @param data Create milestone request
     * @returns Created milestone
     */
    createMilestone = async (data: CreateMilestoneRequest): Promise<Milestone> => {
        try {
            const response = await axiosInstance.post<MilestoneResponse>(
                "/milestones",
                data
            );

            if (response.data.success) {
                return response.data.data.milestone;
            }

            throw new Error(response.data.message || "Failed to create milestone");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create milestone";
            throw new Error(message);
        }
    };

    /**
     * Get all milestones for the authenticated user
     * @returns Array of user's milestones
     */
    getAllMilestones = async (): Promise<Milestone[]> => {
        try {
            const response = await axiosInstance.get<MilestonesResponse>("/milestones");

            if (response.data.success) {
                return response.data.data.milestones;
            }

            throw new Error(response.data.message || "Failed to fetch milestones");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch milestones";
            throw new Error(message);
        }
    };

    /**
     * Get milestone by roadmap ID
     * @param roadmapId Roadmap ID
     * @returns Milestone data or null if not found
     */
    getMilestoneByRoadmap = async (roadmapId: string): Promise<Milestone | null> => {
        try {
            const response = await axiosInstance.get<MilestoneResponse>(
                `/milestones/roadmap/${roadmapId}`
            );

            if (response.data.success) {
                return response.data.data.milestone;
            }

            return null;
        } catch (error: any) {
            // Return null if 404 (not found)
            if (error.response?.status === 404) {
                return null;
            }

            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch milestone";
            throw new Error(message);
        }
    };

    /**
     * Get progress for a roadmap
     * @param roadmapId Roadmap ID
     * @returns Progress data with stage details
     */
    getRoadmapProgress = async (roadmapId: string): Promise<MilestoneProgress> => {
        try {
            const response = await axiosInstance.get<{ success: boolean; message: string; data: MilestoneProgress }>(
                `/milestones/progress/${roadmapId}`
            );

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error(response.data.message || "Failed to fetch progress");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch progress";
            throw new Error(message);
        }
    };

    /**
     * Get milestone by ID
     * @param id Milestone ID
     * @returns Milestone data
     */
    getMilestoneById = async (id: string): Promise<Milestone> => {
        try {
            const response = await axiosInstance.get<MilestoneResponse>(
                `/milestones/${id}`
            );

            if (response.data.success) {
                return response.data.data.milestone;
            }

            throw new Error(response.data.message || "Failed to fetch milestone");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch milestone";
            throw new Error(message);
        }
    };

    /**
     * Update milestone
     * @param id Milestone ID
     * @param data Update data
     * @returns Updated milestone
     */
    updateMilestone = async (
        id: string,
        data: UpdateMilestoneRequest
    ): Promise<Milestone> => {
        try {
            const response = await axiosInstance.put<MilestoneResponse>(
                `/milestones/${id}`,
                data
            );

            if (response.data.success) {
                return response.data.data.milestone;
            }

            throw new Error(response.data.message || "Failed to update milestone");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update milestone";
            throw new Error(message);
        }
    };

    /**
     * Start a specific stage
     * @param id Milestone ID
     * @param data Start stage request with stepId
     * @returns Updated milestone
     */
    startStage = async (id: string, data: StartStageRequest): Promise<Milestone> => {
        try {
            const response = await axiosInstance.put<MilestoneResponse>(
                `/milestones/${id}/stage/start`,
                data
            );

            if (response.data.success) {
                return response.data.data.milestone;
            }

            throw new Error(response.data.message || "Failed to start stage");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to start stage";
            throw new Error(message);
        }
    };

    /**
     * Complete a specific stage with feedback
     * @param id Milestone ID
     * @param data Complete stage request with stepId and optional feedback
     * @returns Updated milestone
     */
    completeStage = async (
        id: string,
        data: CompleteStageRequest
    ): Promise<Milestone> => {
        try {
            const response = await axiosInstance.put<MilestoneResponse>(
                `/milestones/${id}/stage/complete`,
                data
            );

            if (response.data.success) {
                return response.data.data.milestone;
            }

            throw new Error(response.data.message || "Failed to complete stage");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to complete stage";
            throw new Error(message);
        }
    };

    /**
     * Update feedback for a specific stage
     * @param id Milestone ID
     * @param data Update feedback request with stepId and feedback
     * @returns Updated milestone
     */
    updateStageFeedback = async (
        id: string,
        data: UpdateStageFeedbackRequest
    ): Promise<Milestone> => {
        try {
            const response = await axiosInstance.put<MilestoneResponse>(
                `/milestones/${id}/stage/feedback`,
                data
            );

            if (response.data.success) {
                return response.data.data.milestone;
            }

            throw new Error(response.data.message || "Failed to update feedback");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update feedback";
            throw new Error(message);
        }
    };

    /**
     * Delete milestone (soft delete)
     * @param id Milestone ID
     * @returns Success message
     */
    deleteMilestone = async (id: string): Promise<void> => {
        try {
            const response = await axiosInstance.delete<MilestoneResponse>(
                `/milestones/${id}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete milestone");
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete milestone";
            throw new Error(message);
        }
    };

    /**
     * Get or create milestone for a roadmap
     * Similar to diagram service's getOrGenerateRoadmap
     * Creates milestone from roadmap if it doesn't exist, otherwise returns existing
     * @param roadmapId Roadmap ID
     * @param milestoneData Milestone creation data
     * @returns Milestone data
     */
    getOrCreateMilestone = async (
        roadmapId: string,
        milestoneData: CreateMilestoneRequest
    ): Promise<Milestone> => {
        try {
            // First, try to get existing milestone by roadmap
            const existingMilestone = await this.getMilestoneByRoadmap(roadmapId);

            if (existingMilestone) {
                return existingMilestone;
            }

            // If not found, create new milestone
            const newMilestone = await this.createMilestone(milestoneData);

            return newMilestone;
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to get or create milestone";
            throw new Error(message);
        }
    };

    // Note: Analytics endpoint not yet implemented on backend
    // Uncomment when backend adds GET /api/milestones/analytics route
    /**
     * Get detailed analytics for the authenticated user
     * @returns Analytics data with overall statistics
     */
    // getAnalytics = async (): Promise<MilestoneAnalytics> => {
    //     try {
    //         const response = await axiosInstance.get<AnalyticsResponse>(
    //             "/milestones/analytics"
    //         );

    //         if (response.data.success) {
    //             return response.data.data;
    //         }

    //         throw new Error(response.data.message || "Failed to fetch analytics");
    //     } catch (error: any) {
    //         const message =
    //             error.response?.data?.message ||
    //             error.message ||
    //             "Failed to fetch analytics";
    //         throw new Error(message);
    //     }
    // };
}

export default new MilestoneService();
