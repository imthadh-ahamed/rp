import authService from '../services/authService.js';
import { created, ok, badRequest, unauthorized, notFound } from '../utils/response.js';

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { user, token } = await authService.register(req.body);
      created(res, { user, token }, 'User registered successfully');
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        return badRequest(res, error.message);
      }
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      ok(res, { user, token }, 'Login successful');
    } catch (error) {
      if (error.message.includes('Invalid') || error.message.includes('deactivated')) {
        return unauthorized(res, error.message);
      }
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      ok(res, { user }, 'Profile fetched successfully');
    } catch (error) {
      if (error.message === 'User not found') {
        return notFound(res, error.message);
      }
      next(error);
    }
  }
}

export default new AuthController();
