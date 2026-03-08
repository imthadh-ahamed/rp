import express from 'express';
import * as milestoneController from '../controllers/milestoneController.js';
import authenticate from '../middlewares/authenticate.js';
import validateRequest from '../middlewares/validateRequest.js';
import {
    createMilestoneValidation,
    milestoneIdValidation,
    roadmapIdValidation,
    stepIdValidation,
    startStageValidation,
    completeStageValidation,
    updateStageFeedbackValidation,
    updateMilestoneValidation
} from '../validations/milestoneValidation.js';

const router = express.Router();

/**
 * @route   POST /api/milestones
 * @desc    Create milestone from roadmap
 * @access  Private
 */
router.post(
    '/',
    authenticate,
    createMilestoneValidation,
    validateRequest,
    milestoneController.createMilestone
);

/**
 * @route   GET /api/milestones
 * @desc    Get all milestones for authenticated user
 * @access  Private
 */
router.get(
    '/',
    authenticate,
    milestoneController.getMilestonesByUser
);

/**
 * @route   GET /api/milestones/roadmap/:roadmapId
 * @desc    Get milestone for a specific roadmap
 * @access  Private
 */
router.get(
    '/roadmap/:roadmapId',
    authenticate,
    roadmapIdValidation,
    validateRequest,
    milestoneController.getMilestoneByRoadmap
);

/**
 * @route   GET /api/milestones/progress/:roadmapId
 * @desc    Get progress for a roadmap
 * @access  Private
 */
router.get(
    '/progress/:roadmapId',
    authenticate,
    roadmapIdValidation,
    validateRequest,
    milestoneController.getRoadmapProgress
);

/**
 * @route   GET /api/milestones/:id
 * @desc    Get milestone by ID
 * @access  Private
 */
router.get(
    '/:id',
    authenticate,
    milestoneIdValidation,
    validateRequest,
    milestoneController.getMilestoneById
);

/**
 * @route   PUT /api/milestones/:id
 * @desc    Update milestone
 * @access  Private
 */
router.put(
    '/:id',
    authenticate,
    updateMilestoneValidation,
    validateRequest,
    milestoneController.updateMilestone
);

/**
 * @route   PUT /api/milestones/:id/stage/start
 * @desc    Mark a specific stage as started
 * @access  Private
 */
router.put(
    '/:id/stage/start',
    authenticate,
    startStageValidation,
    validateRequest,
    milestoneController.startStage
);

/**
 * @route   PUT /api/milestones/:id/stage/complete
 * @desc    Mark a specific stage as complete with feedback
 * @access  Private
 */
router.put(
    '/:id/stage/complete',
    authenticate,
    completeStageValidation,
    validateRequest,
    milestoneController.completeStage
);

/**
 * @route   PUT /api/milestones/:id/stage/feedback
 * @desc    Update feedback for a specific stage
 * @access  Private
 */
router.put(
    '/:id/stage/feedback',
    authenticate,
    updateStageFeedbackValidation,
    validateRequest,
    milestoneController.updateStageFeedback
);

/**
 * @route   DELETE /api/milestones/:id
 * @desc    Delete milestone (soft delete)
 * @access  Private
 */
router.delete(
    '/:id',
    authenticate,
    milestoneIdValidation,
    validateRequest,
    milestoneController.deleteMilestone
);

export default router;