import axiosInstance from "./http-service";
import {
    ALProfile,
    ALProfileResponse,
    ALProfilesResponse,
    CreateALProfileRequest,
    UpdateALProfileRequest,
} from "@/types/profile.types";

/**
 * Profile Service
 * Handles all AL profile operations
 */
class ProfileService {
    /**
     * Create a new AL profile
     * @param data AL profile data
     * @returns Created profile
     */
    createProfile = async (data: CreateALProfileRequest): Promise<ALProfile> => {
        try {
            const response = await axiosInstance.post<ALProfileResponse>(
                "/profiles",
                data
            );

            if (response.data.success) {
                return response.data.data.profile;
            }

            throw new Error(response.data.message || "Failed to create profile");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create profile";
            throw new Error(message);
        }
    };

    /**
     * Get AL profile by ID
     * @param id Profile ID
     * @returns Profile data
     */
    getProfileById = async (id: string): Promise<ALProfile> => {
        try {
            const response = await axiosInstance.get<ALProfileResponse>(
                `/profiles/${id}`
            );

            if (response.data.success) {
                return response.data.data.profile;
            }

            throw new Error(response.data.message || "Failed to fetch profile");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch profile";
            throw new Error(message);
        }
    };

    /**
     * Get all AL profiles
     * @returns Array of profiles and count
     */
    getAllProfiles = async (): Promise<{ profiles: ALProfile[]; count: number }> => {
        try {
            const response = await axiosInstance.get<ALProfilesResponse>("/profiles");

            if (response.data.success) {
                return {
                    profiles: response.data.data.profiles,
                    count: response.data.data.count,
                };
            }

            throw new Error(response.data.message || "Failed to fetch profiles");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch profiles";
            throw new Error(message);
        }
    };

    /**
     * Update AL profile
     * @param id Profile ID
     * @param data Updated profile data
     * @returns Updated profile
     */
    updateProfile = async (
        id: string,
        data: UpdateALProfileRequest
    ): Promise<ALProfile> => {
        try {
            const response = await axiosInstance.put<ALProfileResponse>(
                `/profiles/${id}`,
                data
            );

            if (response.data.success) {
                return response.data.data.profile;
            }

            throw new Error(response.data.message || "Failed to update profile");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update profile";
            throw new Error(message);
        }
    };

    /**
     * Delete AL profile
     * @param id Profile ID
     * @returns Success message
     */
    deleteProfile = async (id: string): Promise<void> => {
        try {
            const response = await axiosInstance.delete<ALProfileResponse>(
                `/profiles/${id}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete profile");
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete profile";
            throw new Error(message);
        }
    };
}

export default new ProfileService();
