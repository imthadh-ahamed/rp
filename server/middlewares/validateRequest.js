import { validationResult } from 'express-validator';
import { unprocessableEntity } from '../utils/response.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return unprocessableEntity(res, 'Validation failed', errors.array());
  }
  
  next();
};

export default validateRequest;
