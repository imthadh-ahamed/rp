import ALProfile from '../models/ALProfile.js';

class ALProfileService {
    /**
     * Create a new AL profile
     * @param {String} userId - User ID
     * @param {Object} profileData - Profile data
     * @returns {Object} Created profile
     */
    async createProfile(userId, profileData) {
        // Check if user already has an active AL profile
        const existingProfile = await ALProfile.findOne({ userId, isDeleted: false });

        if (existingProfile) {
            throw new Error('User already has a profile. Please update instead.');
        }

        // Create new profile
        const profile = await ALProfile.create({
            userId,
            ...profileData,
            qualificationType: 'AL',
            isDeleted: false
        });

        return profile;
    }

    /**
     * Get profile by ID
     * @param {String} profileId - Profile ID
     * @returns {Object} Profile
     */
    async getProfileById(profileId) {
        const profile = await ALProfile.findOne({ _id: profileId, isDeleted: false })
            .populate('userId', 'firstName lastName email');

        if (!profile) {
            throw new Error('Profile not found');
        }

        return profile;
    }

    /**
     * Get all profiles
     * @returns {Array} All profiles
     */
    async getAllProfiles() {
        const profiles = await ALProfile.find({ isDeleted: false })
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 });

        return profiles;
    }

    /**
     * Update profile
     * @param {String} profileId - Profile ID
     * @param {String} userId - User ID (for ownership check)
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated profile
     */
    async updateProfile(profileId, userId, updateData) {
        const profile = await ALProfile.findOne({ _id: profileId, isDeleted: false });

        if (!profile) {
            throw new Error('Profile not found');
        }

        // Check ownership
        if (profile.userId.toString() !== userId) {
            throw new Error('You are not authorized to update this profile');
        }

        // Prevent updating userId, qualificationType, and isDeleted
        delete updateData.userId;
        delete updateData.qualificationType;
        delete updateData.isDeleted;

        // Update profile
        Object.assign(profile, updateData);
        await profile.save();

        return profile;
    }

    /**
     * Delete profile (soft delete)
     * @param {String} profileId - Profile ID
     * @param {String} userId - User ID (for ownership check)
     * @returns {Object} Deleted profile
     */
    async deleteProfile(profileId, userId) {
        const profile = await ALProfile.findOne({ _id: profileId, isDeleted: false });

        if (!profile) {
            throw new Error('Profile not found');
        }

        // Check ownership
        if (profile.userId.toString() !== userId) {
            throw new Error('You are not authorized to delete this profile');
        }

        // Soft delete - set isDeleted to true
        profile.isDeleted = true;
        await profile.save();

        return profile;
    }
}

export default new ALProfileService();
