import express from 'express';
import alProfileController from '../controllers/alProfileController.js';
import authenticate from '../middlewares/authenticate.js';
import validateRequest from '../middlewares/validateRequest.js';
import {
    createALProfileValidation,
    updateALProfileValidation,
    profileIdValidation
} from '../validations/alProfileValidation.js';

const router = express.Router();

/**
 * @route   POST /api/profiles
 * @desc    Create a new AL profile
 * @access  Private
 */
router.post(
    '/',
    authenticate,
    createALProfileValidation,
    validateRequest,
    alProfileController.createProfile
);

/**
 * @route   GET /api/profiles/:id
 * @desc    Get AL profile by ID
 * @access  Public
 */
router.get(
    '/:id',
    profileIdValidation,
    validateRequest,
    alProfileController.getProfileById
);

/**
 * @route   GET /api/profiles
 * @desc    Get all AL profiles
 * @access  Public
 */
router.get(
    '/',
    alProfileController.getAllProfiles
);

/**
 * @route   PUT /api/profiles/:id
 * @desc    Update AL profile
 * @access  Private
 */
router.put(
    '/:id',
    authenticate,
    updateALProfileValidation,
    validateRequest,
    alProfileController.updateProfile
);

/**
 * @route   DELETE /api/profiles/:id
 * @desc    Delete AL profile
 * @access  Private
 */
router.delete(
    '/:id',
    authenticate,
    profileIdValidation,
    validateRequest,
    alProfileController.deleteProfile
);

export default router;
