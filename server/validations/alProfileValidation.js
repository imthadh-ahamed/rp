import { body, param } from 'express-validator';

/**
 * Validation rules for creating AL profile
 */
export const createALProfileValidation = [
    body('age').notEmpty().trim().withMessage('Age is required'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
    body('nativeLanguage').isIn(['English', 'Sinhala', 'Tamil']).withMessage('Valid native language is required'),
    body('preferredLanguage').isIn(['English', 'Sinhala', 'Tamil']).withMessage('Valid preferred language is required'),
    body('olResults').notEmpty().trim().withMessage('O/L results are required'),
    body('alStream').optional().isIn(['Bio Science', 'Physical Science', 'Commerce', 'Arts', 'Engineering Technology', 'Bio-systems Technology']).withMessage('Valid A/L stream is required'),
    body('alResults').optional().trim(),
    body('otherQualifications').optional().trim(),
    body('ieltsScore').optional().trim(),
    body('interestArea').isIn(['Information Technology', 'Business & Management', 'Engineering/Technology', 'Arts & Design', 'Healthcare/Medicine', 'Education/Teaching', 'Agriculture/Environment']).withMessage('Valid interest area is required'),
    body('careerGoal').notEmpty().trim().withMessage('Career goal is required'),
    body('monthlyIncome').notEmpty().trim().withMessage('Monthly income is required'),
    body('fundingMethod').isIn(['Self-funded', 'Need scholarship']).withMessage('Valid funding method is required'),
    body('availability').isIn(['Weekday', 'Weekend']).withMessage('Valid availability is required'),
    body('completionPeriod').isIn(['< 1 year', '1–2 years', '2-3 years', '3-4 years', '4+ years']).withMessage('Valid completion period is required'),
    body('studyMethod').isIn(['Hybrid', 'Online', 'Onsite']).withMessage('Valid study method is required'),
    body('currentLocation').notEmpty().trim().withMessage('Current location is required'),
    body('preferredLocations').notEmpty().trim().withMessage('Preferred locations are required')
];

/**
 * Validation rules for updating AL profile
 */
export const updateALProfileValidation = [
    param('id').isMongoId().withMessage('Invalid profile ID'),
    body('age').optional().trim(),
    body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
    body('nativeLanguage').optional().isIn(['English', 'Sinhala', 'Tamil']).withMessage('Valid native language is required'),
    body('preferredLanguage').optional().isIn(['English', 'Sinhala', 'Tamil']).withMessage('Valid preferred language is required'),
    body('olResults').optional().trim(),
    body('alStream').optional().isIn(['Bio Science', 'Physical Science', 'Commerce', 'Arts', 'Engineering Technology', 'Bio-systems Technology']).withMessage('Valid A/L stream is required'),
    body('alResults').optional().trim(),
    body('otherQualifications').optional().trim(),
    body('ieltsScore').optional().trim(),
    body('interestArea').optional().isIn(['Information Technology', 'Business & Management', 'Engineering/Technology', 'Arts & Design', 'Healthcare/Medicine', 'Education/Teaching', 'Agriculture/Environment']).withMessage('Valid interest area is required'),
    body('careerGoal').optional().trim(),
    body('monthlyIncome').optional().trim(),
    body('fundingMethod').optional().isIn(['Self-funded', 'Need scholarship']).withMessage('Valid funding method is required'),
    body('availability').optional().isIn(['Weekday', 'Weekend']).withMessage('Valid availability is required'),
    body('completionPeriod').optional().isIn(['< 1 year', '1–2 years', '2-3 years', '3-4 years', '4+ years']).withMessage('Valid completion period is required'),
    body('studyMethod').optional().isIn(['Hybrid', 'Online', 'Onsite']).withMessage('Valid study method is required'),
    body('currentLocation').optional().trim(),
    body('preferredLocations').optional().trim()
];

/**
 * Validation rules for getting/deleting profile by ID
 */
export const profileIdValidation = [
    param('id').isMongoId().withMessage('Invalid profile ID')
];
