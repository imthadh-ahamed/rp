import express from 'express';
import diagramController from '../controllers/diagramController.js';
import authenticate from '../middlewares/authenticate.js';
import validateRequest from '../middlewares/validateRequest.js';
import {
    roadmapIdValidation,
    profileCourseValidation,
    generateRoadmapValidation
} from '../validations/diagramValidation.js';

const router = express.Router();

/**
 * @route   POST /api/diagram
 * @desc    Generate learning roadmap using AI engine
 * @access  Private
 */
router.post(
    '/',
    authenticate,
    generateRoadmapValidation,
    validateRequest,
    diagramController.generateRoadmap
);

/**
 * @route   GET /api/diagram/:id
 * @desc    Get roadmap by ID
 * @access  Private
 */
router.get(
    '/:id',
    authenticate,
    roadmapIdValidation,
    validateRequest,
    diagramController.getRoadmapById
);

/**
 * @route   GET /api/diagram
 * @desc    Get all roadmaps for logged-in user
 * @access  Private
 */
router.get(
    '/',
    authenticate,
    diagramController.getAllRoadmaps
);

/**
 * @route   GET /api/diagram/profile/:profileId/course/:courseId
 * @desc    Get roadmap by profile and course
 * @access  Private
 */
router.get(
    '/profile/:profileId/course/:courseId',
    authenticate,
    profileCourseValidation,
    validateRequest,
    diagramController.getRoadmapByProfileAndCourse
);

/**
 * @route   DELETE /api/diagram/:id
 * @desc    Delete roadmap
 * @access  Private
 */
router.delete(
    '/:id',
    authenticate,
    roadmapIdValidation,
    validateRequest,
    diagramController.deleteRoadmap
);

export default router;
