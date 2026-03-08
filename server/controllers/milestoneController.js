import * as milestoneServices from '../services/milestoneServices.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Create milestone from roadmap
 * POST /api/milestones
 */
export const createMilestone = async (req, res) => {
    try {
        const { profileId, roadmapId, courseId, courseName, university, careerGoal, title, description, stages } = req.body;
        const userId = req.user.id;

        const milestone = await milestoneServices.createMilestone({
            userId,
            profileId,
            roadmapId,
            courseId,
            courseName,
            university,
            careerGoal,
            title,
            description,
            stages
        });

        return successResponse(res, 201, { milestone }, 'Milestone created successfully');
    } catch (error) {
        console.error('Create milestone error:', error);
        return errorResponse(res, 500, error.message || 'Failed to create milestone');
    }
};

/**
 * Get milestone for a roadmap
 * GET /api/milestones/roadmap/:roadmapId
 */
export const getMilestoneByRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.params;

        const milestone = await milestoneServices.getMilestoneByRoadmap(roadmapId);

        return successResponse(res, 200, { milestone }, 'Milestone retrieved successfully');
    } catch (error) {
        console.error('Get milestone by roadmap error:', error);
        const statusCode = error.message === 'Milestone not found' ? 404 : 500;
        return errorResponse(res, statusCode, error.message || 'Failed to retrieve milestone');
    }
};

/**
 * Get milestone by ID
 * GET /api/milestones/:id
 */
export const getMilestoneById = async (req, res) => {
    try {
        const { id } = req.params;

        const milestone = await milestoneServices.getMilestoneById(id);

        return successResponse(res, 200, { milestone }, 'Milestone retrieved successfully');
    } catch (error) {
        console.error('Get milestone by ID error:', error);
        return errorResponse(res, 404, error.message || 'Milestone not found');
    }
};

/**
 * Get all milestones for authenticated user
 * GET /api/milestones
 */
export const getMilestonesByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const milestones = await milestoneServices.getMilestonesByUser(userId);

        return successResponse(res, 200, { milestones }, 'User milestones retrieved successfully');
    } catch (error) {
        console.error('Get user milestones error:', error);
        return errorResponse(res, 500, error.message || 'Failed to retrieve milestones');
    }
};

/**
 * Update milestone
 * PUT /api/milestones/:id
 */
export const updateMilestone = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updateData = req.body;

        const milestone = await milestoneServices.updateMilestone(id, userId, updateData);

        return successResponse(res, 200, { milestone }, 'Milestone updated successfully');
    } catch (error) {
        console.error('Update milestone error:', error);
        return errorResponse(res, 500, error.message || 'Failed to update milestone');
    }
};

/**
 * Start a specific stage
 * PUT /api/milestones/:id/stage/start
 */
export const startStage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { stepId } = req.body;

        const milestone = await milestoneServices.startStage(id, userId, stepId);

        return successResponse(res, 200, { milestone }, 'Stage started successfully');
    } catch (error) {
        console.error('Start stage error:', error);
        return errorResponse(res, 500, error.message || 'Failed to start stage');
    }
};

/**
 * Complete a specific stage with feedback
 * PUT /api/milestones/:id/stage/complete
 */
export const completeStage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { stepId, feedback } = req.body;

        const milestone = await milestoneServices.completeStage(id, userId, stepId, feedback);

        return successResponse(res, 200, { milestone }, 'Stage completed successfully');
    } catch (error) {
        console.error('Complete stage error:', error);
        return errorResponse(res, 500, error.message || 'Failed to complete stage');
    }
};

/**
 * Update feedback for a specific stage
 * PUT /api/milestones/:id/stage/feedback
 */
export const updateStageFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { stepId, feedback } = req.body;

        const milestone = await milestoneServices.updateStageFeedback(id, userId, stepId, feedback);

        return successResponse(res, 200, { milestone }, 'Feedback updated successfully');
    } catch (error) {
        console.error('Update feedback error:', error);
        return errorResponse(res, 500, error.message || 'Failed to update feedback');
    }
};

/**
 * Get roadmap progress
 * GET /api/milestones/progress/:roadmapId
 */
export const getRoadmapProgress = async (req, res) => {
    try {
        const { roadmapId } = req.params;

        const progress = await milestoneServices.getRoadmapProgress(roadmapId);

        return successResponse(res, 200, progress, 'Progress retrieved successfully');
    } catch (error) {
        console.error('Get roadmap progress error:', error);
        return errorResponse(res, 500, error.message || 'Failed to retrieve progress');
    }
};

/**
 * Delete milestone (soft delete)
 * DELETE /api/milestones/:id
 */
export const deleteMilestone = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const milestone = await milestoneServices.deleteMilestone(id, userId);

        return successResponse(res, 200, { milestone }, 'Milestone deleted successfully');
    } catch (error) {
        console.error('Delete milestone error:', error);
        return errorResponse(res, 500, error.message || 'Failed to delete milestone');
    }
};

