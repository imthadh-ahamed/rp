import { body, param } from 'express-validator';

/**
 * Validation for creating milestone from roadmap
 */
export const createMilestoneValidation = [
    body('profileId')
        .notEmpty()
        .withMessage('Profile ID is required')
        .isMongoId()
        .withMessage('Invalid profile ID format'),
    
    body('roadmapId')
        .notEmpty()
        .withMessage('Roadmap ID is required')
        .isMongoId()
        .withMessage('Invalid roadmap ID format'),
    
    body('courseId')
        .notEmpty()
        .withMessage('Course ID is required')
        .trim(),
    
    body('courseName')
        .notEmpty()
        .withMessage('Course name is required')
        .trim(),
    
    body('university')
        .notEmpty()
        .withMessage('University is required')
        .trim(),
    
    body('careerGoal')
        .notEmpty()
        .withMessage('Career goal is required')
        .trim(),
    
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be 1000 characters or less'),
    
    body('stages')
        .isArray({ min: 6, max: 6 })
        .withMessage('Must have exactly 6 stages'),
    
    body('stages.*.stepId')
        .notEmpty()
        .withMessage('Step ID is required')
        .isInt({ min: 1, max: 6 })
        .withMessage('Step ID must be between 1 and 6'),
    
    body('stages.*.stepTitle')
        .notEmpty()
        .withMessage('Step title is required')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Step title must be between 1 and 200 characters'),
    
    body('stages.*.stepGoal')
        .notEmpty()
        .withMessage('Step goal is required')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Step goal must be between 1 and 500 characters'),
    
    body('stages.*.description')
        .notEmpty()
        .withMessage('Stage description is required')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Description must be between 1 and 1000 characters'),
    
    body('stages.*.duration')
        .notEmpty()
        .withMessage('Duration is required')
        .trim(),
    
    body('stages.*.icon')
        .optional()
        .trim(),
    
    body('stages.*.color')
        .optional()
        .trim(),
    
    body('stages.*.actionPlan')
        .optional()
        .isArray()
        .withMessage('Action plan must be an array'),
    
    body('stages.*.resources')
        .optional()
        .isArray()
        .withMessage('Resources must be an array'),
    
    body('stages.*.successCriteria')
        .optional()
        .isArray()
        .withMessage('Success criteria must be an array')
];

/**
 * Validation for milestone ID parameter
 */
export const milestoneIdValidation = [
    param('id')
        .notEmpty()
        .withMessage('Milestone ID is required')
        .isMongoId()
        .withMessage('Invalid milestone ID format')
];

/**
 * Validation for roadmap ID parameter
 */
export const roadmapIdValidation = [
    param('roadmapId')
        .notEmpty()
        .withMessage('Roadmap ID is required')
        .isMongoId()
        .withMessage('Invalid roadmap ID format')
];

/**
 * Validation for step ID parameter
 */
export const stepIdValidation = [
    param('stepId')
        .notEmpty()
        .withMessage('Step ID is required')
        .isInt({ min: 1, max: 6 })
        .withMessage('Step ID must be between 1 and 6')
];

/**
 * Validation for starting a stage
 */
export const startStageValidation = [
    param('id')
        .notEmpty()
        .withMessage('Milestone ID is required')
        .isMongoId()
        .withMessage('Invalid milestone ID format'),
    
    body('stepId')
        .notEmpty()
        .withMessage('Step ID is required')
        .isInt({ min: 1, max: 6 })
        .withMessage('Step ID must be between 1 and 6')
];

/**
 * Validation for completing a stage
 */
export const completeStageValidation = [
    param('id')
        .notEmpty()
        .withMessage('Milestone ID is required')
        .isMongoId()
        .withMessage('Invalid milestone ID format'),
    
    body('stepId')
        .notEmpty()
        .withMessage('Step ID is required')
        .isInt({ min: 1, max: 6 })
        .withMessage('Step ID must be between 1 and 6'),
    
    body('feedback')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Feedback must be 1000 characters or less')
];

/**
 * Validation for updating stage feedback
 */
export const updateStageFeedbackValidation = [
    param('id')
        .notEmpty()
        .withMessage('Milestone ID is required')
        .isMongoId()
        .withMessage('Invalid milestone ID format'),
    
    body('stepId')
        .notEmpty()
        .withMessage('Step ID is required')
        .isInt({ min: 1, max: 6 })
        .withMessage('Step ID must be between 1 and 6'),
    
    body('feedback')
        .notEmpty()
        .withMessage('Feedback is required')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Feedback must be between 1 and 1000 characters')
];

/**
 * Validation for updating milestone
 */
export const updateMilestoneValidation = [
    param('id')
        .notEmpty()
        .withMessage('Milestone ID is required')
        .isMongoId()
        .withMessage('Invalid milestone ID format'),
    
    body('overallStatus')
        .optional()
        .isIn(['pending', 'in_progress', 'completed'])
        .withMessage('Status must be one of: pending, in_progress, completed'),
    
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be 1000 characters or less')
];