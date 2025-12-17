import alProfileService from '../services/alProfileService.js';
import { created, ok, badRequest, notFound, forbidden } from '../utils/response.js';

class ALProfileController {
    /**
     * Create a new AL profile
     * POST /api/profiles
     */
    async createProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { profile, recommendations } = await alProfileService.createProfile(userId, req.body);
            created(res, { profile, recommendations }, 'AL profile created successfully');
        } catch (error) {
            if (error.message.includes('already has a profile')) {
                return badRequest(res, error.message);
            }
            next(error);
        }
    }

    /**
     * Get profile by ID
     * GET /api/profiles/:id
     */
    async getProfileById(req, res, next) {
        try {
            const { id } = req.params;
            const profile = await alProfileService.getProfileById(id);
            ok(res, { profile }, 'Profile fetched successfully');
        } catch (error) {
            if (error.message === 'Profile not found') {
                return notFound(res, error.message);
            }
            next(error);
        }
    }

    /**
     * Get all profiles for the logged-in user
     * GET /api/profiles
     */
    async getAllProfiles(req, res, next) {
        try {
            const userId = req.user.id;
            const profiles = await alProfileService.getAllProfiles(userId);
            
            // Set cache-control headers to return 200 instead of 304
            res.set({
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            
            ok(res, { profiles, count: profiles.length }, 'Profiles fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update profile
     * PUT /api/profiles/:id
     */
    async updateProfile(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const profile = await alProfileService.updateProfile(id, userId, req.body);
            ok(res, { profile }, 'Profile updated successfully');
        } catch (error) {
            if (error.message === 'Profile not found') {
                return notFound(res, error.message);
            }
            if (error.message.includes('not authorized')) {
                return forbidden(res, error.message);
            }
            next(error);
        }
    }

    /**
     * Delete profile
     * DELETE /api/profiles/:id
     */
    async deleteProfile(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await alProfileService.deleteProfile(id, userId);
            ok(res, null, 'Profile deleted successfully');
        } catch (error) {
            if (error.message === 'Profile not found') {
                return notFound(res, error.message);
            }
            if (error.message.includes('not authorized')) {
                return forbidden(res, error.message);
            }
            next(error);
        }
    }
}

export default new ALProfileController();
