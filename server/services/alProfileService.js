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

        // Fetch AI Recommendations
        let recommendations = null;
        try {
            recommendations = await this.getRecommendations(profileData);
        } catch (error) {
            console.error('Error fetching recommendations:', error.message);
            // We don't block profile creation if AI fails, just return null recommendations
        }
        console.log(recommendations);
        return { profile, recommendations };
    }

    /**
     * Fetch course recommendations from Python Agentic API
     * @param {Object} profileData - User profile data
     * @returns {Object} Recommendation response
     */
    async getRecommendations(profileData) {
        try {
            // Map Node.js camelCase to Python snake_case
            const pythonPayload = {
                age: profileData.age,
                native_language: profileData.nativeLanguage,
                preferred_language: profileData.preferredLanguage,
                ol_results: profileData.olResults,
                al_stream: profileData.alStream,
                al_results: profileData.alResults,
                other_qualifications: profileData.otherQualifications,
                ielts: profileData.ieltsScore, // Note: ieltsScore -> ielts
                interest_area: profileData.interestArea,
                career_goal: profileData.careerGoal,
                income: profileData.monthlyIncome, // Note: monthlyIncome -> income
                study_method: profileData.studyMethod,
                availability: profileData.availability,
                completion_period: profileData.completionPeriod,
                current_location: profileData.currentLocation,
                preferred_locations: profileData.preferredLocations
            };

            const response = await fetch('http://localhost:8000/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pythonPayload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to connect to Recommendation API:', error);
            return null;
        }
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
