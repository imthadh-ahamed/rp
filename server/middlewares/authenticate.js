import jwt from 'jsonwebtoken';
import { unauthorized } from '../utils/response.js';

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return unauthorized(res, 'No authentication token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return unauthorized(res, 'Invalid or expired token');
  }
};

export default authenticate;
