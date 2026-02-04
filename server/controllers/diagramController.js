import diagramService from '../services/diagramService.js';
import { created, ok, badRequest, notFound, forbidden } from '../utils/response.js';

class DiagramController {
    /**
     * Generate roadmap diagram
     * POST /api/diagram
     */
    async generateRoadmap(req, res, next) {
        try {
            const userId = req.user.id;
            const { profileId, courseId } = req.body;

            const roadmap = await diagramService.generateRoadmap(
                userId,
                profileId,
                courseId
            );

            created(res, { roadmap }, 'Roadmap generated successfully');
        } catch (error) {
            if (error.message.includes('Profile not found')) {
                return notFound(res, error.message);
            }
            if (error.message.includes('access denied')) {
                return forbidden(res, 'Access denied to this profile');
            }
            if (error.message.includes('Course with rank')) {
                return notFound(res, error.message);
            }
            if (error.message.includes('No course recommendations')) {
                return badRequest(res, error.message);
            }
            if (error.message.includes('Roadmap API')) {
                return badRequest(res, error.message);
            }
            next(error);
        }
    }

    /**
     * Get roadmap by ID
     * GET /api/diagram/:id
     */
    async getRoadmapById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const roadmap = await diagramService.getRoadmapById(id, userId);
            ok(res, { roadmap }, 'Roadmap fetched successfully');
        } catch (error) {
            if (error.message === 'Roadmap not found') {
                return notFound(res, error.message);
            }
            next(error);
        }
    }

    /**
     * Get all roadmaps for logged-in user
     * GET /api/diagram
     */
    async getAllRoadmaps(req, res, next) {
        try {
            const userId = req.user.id;
            const roadmaps = await diagramService.getAllRoadmaps(userId);
            ok(res, { roadmaps }, 'Roadmaps fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get roadmap by profile and course
     * GET /api/diagram/profile/:profileId/course/:courseId
     */
    async getRoadmapByProfileAndCourse(req, res, next) {
        try {
            const userId = req.user.id;
            const { profileId, courseId } = req.params;

            const roadmap = await diagramService.getRoadmapByProfileAndCourse(
                userId,
                profileId,
                courseId
            );

            if (!roadmap) {
                return notFound(res, 'Roadmap not found for this profile and course');
            }

            ok(res, { roadmap }, 'Roadmap fetched successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete roadmap
     * DELETE /api/diagram/:id
     */
    async deleteRoadmap(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            await diagramService.deleteRoadmap(id, userId);
            ok(res, null, 'Roadmap deleted successfully');
        } catch (error) {
            if (error.message === 'Roadmap not found') {
                return notFound(res, error.message);
            }
            next(error);
        }
    }
}

export default new DiagramController();