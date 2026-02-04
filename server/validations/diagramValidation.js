import { body, param } from 'express-validator';

/**
 * Validation for generating roadmap
 */
export const generateRoadmapValidation = [
    body('profileId')
        .notEmpty().withMessage('Profile ID is required')
        .isMongoId().withMessage('Invalid profile ID format'),
    
    body('courseId')
        .notEmpty().withMessage('Course ID is required')
        .isString().withMessage('Course ID must be a string')
];

/**
 * Validation for roadmap ID parameter
 */
export const roadmapIdValidation = [
    param('id')
        .notEmpty().withMessage('Roadmap ID is required')
        .isMongoId().withMessage('Invalid roadmap ID format')
];

/**
 * Validation for profile and course parameters
 */
export const profileCourseValidation = [
    param('profileId')
        .notEmpty().withMessage('Profile ID is required')
        .isMongoId().withMessage('Invalid profile ID format'),
    
    param('courseId')
        .notEmpty().withMessage('Course ID is required')
        .isString().withMessage('Invalid course ID format')
];