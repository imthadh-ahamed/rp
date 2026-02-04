import Roadmap from '../models/Roadmap.js';
import ALProfile from '../models/ALProfile.js';
import axios from 'axios';

class DiagramService {
    /**
     * Generate roadmap diagram
     * @param {String} userId - User ID from authentication
     * @param {String} profileId - AL Profile ID
     * @param {String} courseId - Course ID (rank from recommendations)
     * @returns {Object} Generated roadmap
     */
    async generateRoadmap(userId, profileId, courseId) {
        // 1. Check if roadmap already exists for this combination
        const existingRoadmap = await Roadmap.findOne({
            userId,
            profileId,
            courseId,
            isDeleted: false
        });

        if (existingRoadmap) {
            return existingRoadmap;
        }

        // 2. Get profile data
        const userProfileData = await this.getProfileData(profileId, userId);

        // 3. Get course data from recommendations
        const selectedCourse = await this.getCourseData(profileId, courseId);

        // 4. Combine data for Python API
        const combinedData = this.combinedData(userProfileData, selectedCourse);

        // 5. Call Python Roadmap Generation API
        const roadmapResponse = await this.callRoadmapAPI(
            combinedData.user_profile,
            combinedData.selected_course
        );

        // 6. Map roadmap steps to include frontend-specific fields
        const mappedRoadmap = this.mapRoadmapSteps(roadmapResponse.roadmap);

        // 7. Save to database
        const roadmap = await Roadmap.create({
            userId,
            profileId,
            courseId,
            courseName: selectedCourse.course_name,
            university: selectedCourse.university,
            careerGoal: userProfileData.careerGoal,
            status: roadmapResponse.status,
            roadmap: mappedRoadmap,
            metadata: roadmapResponse.metadata || {},
            warnings: roadmapResponse.warnings || [],
            errors: roadmapResponse.errors || []
        });

        return roadmap;
    }

    /**
     * Get profile data for Python API
     * @param {String} profileId - AL Profile ID
     * @param {String} userId - User ID for authorization
     * @returns {Object} User profile data
     */
    async getProfileData(profileId, userId) {
        const profile = await ALProfile.findOne({
            _id: profileId,
            userId,
            isDeleted: false
        });

        if (!profile) {
            throw new Error('Profile not found or access denied');
        }

        return {
            age: profile.age,
            gender: profile.gender,
            nativeLanguage: profile.nativeLanguage,
            preferredLanguage: profile.preferredLanguage,
            olResults: profile.olResults,
            alStream: profile.alStream,
            alResults: profile.alResults,
            otherQualifications: profile.otherQualifications,
            ieltsScore: profile.ieltsScore,
            interestArea: profile.interestArea,
            careerGoal: profile.careerGoal,
            monthlyIncome: profile.monthlyIncome,
            fundingMethod: profile.fundingMethod,
            availability: profile.availability,
            completionPeriod: profile.completionPeriod,
            studyMethod: profile.studyMethod,
            currentLocation: profile.currentLocation,
            preferredLocations: profile.preferredLocations
        };
    }

    /**
     * Get course data from profile recommendations
     * @param {String} profileId - AL Profile ID
     * @param {String} courseId - Course ID (rank number)
     * @returns {Object} Selected course data
     */
    async getCourseData(profileId, courseId) {
        const profile = await ALProfile.findOne({
            _id: profileId,
            isDeleted: false
        });

        if (!profile) {
            throw new Error('Profile not found');
        }

        if (!profile.recommendations || profile.recommendations.length === 0) {
            throw new Error('No course recommendations found for this profile');
        }

        // Find course by rank (courseId is the rank number)
        const course = profile.recommendations.find(
            rec => rec.rank === parseInt(courseId)
        );

        if (!course) {
            throw new Error(`Course with rank ${courseId} not found in recommendations`);
        }

        return {
            course_name: course.course_name,
            university: course.university,
            location: course.location,
            match_score: course.match_score,
            explanation: course.explanation,
            url: course.url,
            career_opportunities: course.career_opportunities,
            study_language: course.study_language,
            study_method: course.study_method,
            duration: course.duration,
            requirements: course.requirements,
            course_fee: course.course_fee,
            department: course.department
        };
    }

    /**
     * Combine profile and course data for Python API
     * @param {Object} userProfileData - User profile data
     * @param {Object} selectedCourse - Selected course data
     * @returns {Object} Combined data
     */
    combinedData(userProfileData, selectedCourse) {
        return {
            user_profile: userProfileData,
            selected_course: selectedCourse
        };
    }

    /**
     * Get roadmap by ID
     * @param {String} roadmapId - Roadmap ID
     * @param {String} userId - User ID for authorization
     * @returns {Object} Roadmap document
     */
    async getRoadmapById(roadmapId, userId) {
        const roadmap = await Roadmap.findOne({
            _id: roadmapId,
            userId,
            isDeleted: false
        });

        if (!roadmap) {
            throw new Error('Roadmap not found');
        }

        return roadmap;
    }

    /**
     * Get all roadmaps for a user
     * @param {String} userId - User ID
     * @returns {Array} List of roadmaps
     */
    async getAllRoadmaps(userId) {
        const roadmaps = await Roadmap.find({
            userId,
            isDeleted: false
        }).sort({ createdAt: -1 });

        return roadmaps;
    }

    /**
     * Get roadmap by profile and course
     * @param {String} userId - User ID
     * @param {String} profileId - Profile ID
     * @param {String} courseId - Course ID
     * @returns {Object} Roadmap document
     */
    async getRoadmapByProfileAndCourse(userId, profileId, courseId) {
        const roadmap = await Roadmap.findOne({
            userId,
            profileId,
            courseId,
            isDeleted: false
        });

        return roadmap; // May be null if not found
    }

    /**
     * Delete roadmap
     * @param {String} roadmapId - Roadmap ID
     * @param {String} userId - User ID for authorization
     * @returns {Boolean} Success status
     */
    async deleteRoadmap(roadmapId, userId) {
        const roadmap = await Roadmap.findOne({
            _id: roadmapId,
            userId,
            isDeleted: false
        });

        if (!roadmap) {
            throw new Error('Roadmap not found');
        }

        roadmap.isDeleted = true;
        await roadmap.save();

        return true;
    }

    /**
     * Call Python Roadmap Generation API
     * @param {Object} userProfile - User profile data
     * @param {Object} selectedCourse - Course details
     * @returns {Object} API response
     */
    async callRoadmapAPI(userProfile, selectedCourse) {
        const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';
        const endpoint = `${PYTHON_API_URL}/roadmap/generate`;

        try {
            const response = await axios.post(endpoint, {
                user_profile: userProfile,
                selected_course: selectedCourse
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 seconds
            });

            return response.data;
        } catch (error) {
            console.error('Error calling Python Roadmap API:', error.message);
            
            if (error.response) {
                throw new Error(`Roadmap API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                throw new Error('No response from Roadmap API. Ensure Python backend is running.');
            } else {
                throw new Error(`Roadmap API request failed: ${error.message}`);
            }
        }
    }

    /**
     * Map roadmap steps to include frontend-specific fields
     * @param {Array} roadmapSteps - Steps from Python API
     * @returns {Array} Mapped steps
     */
    mapRoadmapSteps(roadmapSteps) {
        const colorMap = [
            { color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
            { color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-600' },
            { color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600' },
            { color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-600' },
            { color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-600' },
            { color: 'bg-indigo-500', lightColor: 'bg-indigo-50', textColor: 'text-indigo-600' }
        ];

        return roadmapSteps.map((step, index) => ({
            id: step.id,
            title: step.title,
            goal: step.goal,
            icon: step.icon || 'BookOpen',
            duration: step.duration,
            description: step.description,
            actionPlan: step.actionPlan,
            resources: step.resources,
            successCriteria: step.successCriteria,
            // Add frontend colors
            ...colorMap[index % colorMap.length]
        }));
    }
}

export default new DiagramService();