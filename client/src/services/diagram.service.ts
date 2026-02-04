import axiosInstance from "./http-service";
import {
    Roadmap,
    GenerateRoadmapRequest,
    RoadmapResponse,
    RoadmapsResponse,
} from "@/types/diagram.types";

/**
 * Diagram Service Class
 */
class DiagramService {
    /**
     * Generate a new roadmap
     * @param data Generate roadmap request (profileId and courseId)
     * @returns Generated roadmap
     */
    generateRoadmap = async (data: GenerateRoadmapRequest): Promise<Roadmap> => {
        try {
            const response = await axiosInstance.post<RoadmapResponse>(
                "/diagram",
                data
            );

            if (response.data.success) {
                return response.data.data.roadmap;
            }

            throw new Error(response.data.message || "Failed to generate roadmap");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to generate roadmap";
            throw new Error(message);
        }
    };

    /**
     * Get roadmap by ID
     * @param id Roadmap ID
     * @returns Roadmap data
     */
    getRoadmapById = async (id: string): Promise<Roadmap> => {
        try {
            const response = await axiosInstance.get<RoadmapResponse>(
                `/diagram/${id}`
            );

            if (response.data.success) {
                return response.data.data.roadmap;
            }

            throw new Error(response.data.message || "Failed to fetch roadmap");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch roadmap";
            throw new Error(message);
        }
    };

    /**
     * Get all roadmaps for the logged-in user
     * @returns Array of user's roadmaps
     */
    getAllRoadmaps = async (): Promise<Roadmap[]> => {
        try {
            const response = await axiosInstance.get<RoadmapsResponse>("/diagram");

            if (response.data.success) {
                return response.data.data.roadmaps;
            }

            throw new Error(response.data.message || "Failed to fetch roadmaps");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch roadmaps";
            throw new Error(message);
        }
    };

    /**
     * Get roadmap by profile and course
     * @param profileId Profile ID
     * @param courseId Course ID (rank number)
     * @returns Roadmap data or null if not found
     */
    getRoadmapByProfileAndCourse = async (
        profileId: string,
        courseId: string
    ): Promise<Roadmap | null> => {
        try {
            const response = await axiosInstance.get<RoadmapResponse>(
                `/diagram/profile/${profileId}/course/${courseId}`
            );

            if (response.data.success) {
                return response.data.data.roadmap;
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
                "Failed to fetch roadmap";
            throw new Error(message);
        }
    };

    /**
     * Delete roadmap
     * @param id Roadmap ID
     * @returns Success message
     */
    deleteRoadmap = async (id: string): Promise<void> => {
        try {
            const response = await axiosInstance.delete<RoadmapResponse>(
                `/diagram/${id}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete roadmap");
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete roadmap";
            throw new Error(message);
        }
    };

    /**
     * Generate or get existing roadmap
     * Generates a new roadmap, then retrieves it to ensure complete data
     * @param profileId Profile ID
     * @param courseId Course ID (rank number)
     * @returns Roadmap data
     */
    getOrGenerateRoadmap = async (
        profileId: string,
        courseId: string
    ): Promise<Roadmap> => {
        try {
            // First, generate the roadmap (POST /api/diagram)
            // This will create a new roadmap or return existing one from backend
            await this.generateRoadmap({ profileId, courseId });

            // After generation completes, fetch the roadmap by profile and course
            // (GET /api/diagram/profile/:profileId/course/:courseId)
            // This ensures we get the complete, freshly generated data
            const roadmap = await this.getRoadmapByProfileAndCourse(
                profileId,
                courseId
            );

            if (!roadmap) {
                throw new Error("Roadmap was generated but could not be retrieved");
            }

            return roadmap;
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to get or generate roadmap";
            throw new Error(message);
        }
    };
}

export default new DiagramService();
