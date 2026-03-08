import Milestone from '../models/Milestone.js';
import mongoose from 'mongoose';

/**
 * Create milestone from roadmap
 * @param {Object} data - Milestone data
 * @returns {Promise<Object>} Created milestone
 */
export const createMilestone = async (data) => {
    const { userId, profileId, roadmapId, courseId, courseName, university, careerGoal, title, description, stages } = data;

    // Validate roadmap exists
    const Roadmap = mongoose.model('Roadmap');
    const roadmap = await Roadmap.findById(roadmapId);
    
    if (!roadmap) {
        throw new Error('Roadmap not found');
    }

    // Check if milestone already exists for this user and roadmap
    const existingMilestone = await Milestone.findOne({ 
        userId, 
        roadmapId, 
        isDeleted: false 
    });
    
    if (existingMilestone) {
        return existingMilestone;
    }

    // Create milestone with all 6 stages
    const milestone = new Milestone({
        userId,
        profileId,
        roadmapId,
        courseId,
        courseName,
        university,
        careerGoal,
        title: title || 'Learn-to-Earn Career Pathway',
        description: description || 'Complete all stages of your personalized learning journey to achieve your career goals.',
        stages: stages.map(stage => ({
            stepId: stage.stepId,
            stepTitle: stage.stepTitle,
            stepGoal: stage.stepGoal,
            description: stage.description,
            duration: stage.duration,
            icon: stage.icon || 'BookOpen',
            color: stage.color || 'bg-blue-500',
            actionPlan: stage.actionPlan || [],
            resources: stage.resources || [],
            successCriteria: stage.successCriteria || [],
            status: 'pending'
        })),
        overallStatus: 'pending',
        progressPercentage: 0,
        completedStages: 0
    });

    await milestone.save();
    return milestone;
};

/**
 * Get milestone for a roadmap
 * @param {string} roadmapId - Roadmap ID
 * @returns {Promise<Object>} Milestone
 */
export const getMilestoneByRoadmap = async (roadmapId) => {
    const milestone = await Milestone.findOne({ roadmapId, isDeleted: false })
        .populate('userId', 'email')
        .populate('profileId', 'careerGoal')
        .populate('roadmapId', 'courseName university');
    
    if (!milestone) {
        throw new Error('Milestone not found');
    }
    
    return milestone;
};

/**
 * Get milestone by ID
 * @param {string} milestoneId - Milestone ID
 * @returns {Promise<Object>} Milestone
 */
export const getMilestoneById = async (milestoneId) => {
    const milestone = await Milestone.findOne({ _id: milestoneId, isDeleted: false })
        .populate('userId', 'email')
        .populate('profileId', 'careerGoal')
        .populate('roadmapId', 'courseName university careerGoal roadmap');
    
    if (!milestone) {
        throw new Error('Milestone not found');
    }
    
    return milestone;
};

/**
 * Get all milestones for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Milestones
 */
export const getMilestonesByUser = async (userId) => {
    const milestones = await Milestone.find({ userId, isDeleted: false })
        .sort({ createdAt: -1 })
        .populate('profileId', 'careerGoal')
        .populate('roadmapId', 'courseName university');
    
    return milestones;
};

/**
 * Update milestone
 * @param {string} milestoneId - Milestone ID
 * @param {string} userId - User ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated milestone
 */
export const updateMilestone = async (milestoneId, userId, updateData) => {
    const milestone = await Milestone.findOne({ 
        _id: milestoneId, 
        userId, 
        isDeleted: false 
    });
    
    if (!milestone) {
        throw new Error('Milestone not found or access denied');
    }

    // Update allowed fields
    if (updateData.overallStatus) {
        milestone.overallStatus = updateData.overallStatus;
    }
    if (updateData.title) {
        milestone.title = updateData.title;
    }
    if (updateData.description) {
        milestone.description = updateData.description;
    }

    await milestone.save();
    return milestone;
};

/**
 * Start a specific stage
 * @param {string} milestoneId - Milestone ID
 * @param {string} userId - User ID
 * @param {number} stepId - Step ID (1-6)
 * @returns {Promise<Object>} Updated milestone
 */
export const startStage = async (milestoneId, userId, stepId) => {
    const milestone = await Milestone.findOne({ 
        _id: milestoneId, 
        userId, 
        isDeleted: false 
    });
    
    if (!milestone) {
        throw new Error('Milestone not found or access denied');
    }

    await milestone.markStageAsStarted(stepId);
    
    // Populate before returning
    await milestone.populate('roadmapId', 'courseName university');
    
    return milestone;
};

/**
 * Complete a specific stage with feedback
 * @param {string} milestoneId - Milestone ID
 * @param {string} userId - User ID
 * @param {number} stepId - Step ID (1-6)
 * @param {string} feedback - User feedback
 * @returns {Promise<Object>} Updated milestone
 */
export const completeStage = async (milestoneId, userId, stepId, feedback) => {
    const milestone = await Milestone.findOne({ 
        _id: milestoneId, 
        userId, 
        isDeleted: false 
    });
    
    if (!milestone) {
        throw new Error('Milestone not found or access denied');
    }

    await milestone.markStageAsComplete(stepId, feedback);
    
    // Populate before returning
    await milestone.populate('roadmapId', 'courseName university');
    
    return milestone;
};

/**
 * Update feedback for a specific stage
 * @param {string} milestoneId - Milestone ID
 * @param {string} userId - User ID
 * @param {number} stepId - Step ID (1-6)
 * @param {string} feedback - User feedback
 * @returns {Promise<Object>} Updated milestone
 */
export const updateStageFeedback = async (milestoneId, userId, stepId, feedback) => {
    const milestone = await Milestone.findOne({ 
        _id: milestoneId, 
        userId, 
        isDeleted: false 
    });
    
    if (!milestone) {
        throw new Error('Milestone not found or access denied');
    }

    await milestone.updateStageFeedback(stepId, feedback);
    
    return milestone;
};



/**
 * Get progress for a roadmap
 * @param {string} roadmapId - Roadmap ID
 * @returns {Promise<Object>} Progress data
 */
export const getRoadmapProgress = async (roadmapId) => {
    const progress = await Milestone.getProgress(roadmapId);
    
    const milestones = await Milestone.find({ roadmapId, isDeleted: false })
        .sort({ stepId: 1 })
        .select('stepId stepTitle status completedAt');
    
    return {
        ...progress,
        milestones
    };
};

/**
 * Delete milestone (soft delete)
 * @param {string} milestoneId - Milestone ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deleted milestone
 */
export const deleteMilestone = async (milestoneId, userId) => {
    const milestone = await Milestone.findOne({ 
        _id: milestoneId, 
        userId, 
        isDeleted: false 
    });
    
    if (!milestone) {
        throw new Error('Milestone not found or access denied');
    }

    await milestone.softDelete();
    return milestone;
};

