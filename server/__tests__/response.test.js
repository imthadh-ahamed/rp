import { describe, test, expect, jest } from '@jest/globals';
import {
  HTTP_STATUS,
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessableEntity,
  tooManyRequests,
  internalServerError,
  serviceUnavailable
} from '../utils/response.js';

describe('Response Utility Tests', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('HTTP_STATUS constants', () => {
    test('should have correct status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.NO_CONTENT).toBe(204);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.CONFLICT).toBe(409);
      expect(HTTP_STATUS.UNPROCESSABLE_ENTITY).toBe(422);
      expect(HTTP_STATUS.TOO_MANY_REQUESTS).toBe(429);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HTTP_STATUS.SERVICE_UNAVAILABLE).toBe(503);
    });
  });

  describe('Success Responses', () => {
    test('ok() should send 200 status with success response', () => {
      const data = { user: { id: 1, name: 'Test' } };
      const message = 'Success';

      ok(mockRes, data, message);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
        data
      });
    });

    test('created() should send 201 status with success response', () => {
      const data = { id: 1 };
      const message = 'Resource created';

      created(mockRes, data, message);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
        data
      });
    });

    test('noContent() should send 204 status', () => {
      noContent(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('Client Error Responses', () => {
    test('badRequest() should send 400 status with error response', () => {
      const message = 'Bad request';

      badRequest(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message
      });
    });

    test('unauthorized() should send 401 status with error response', () => {
      const message = 'Unauthorized';

      unauthorized(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message
      });
    });

    test('forbidden() should send 403 status with error response', () => {
      const message = 'Forbidden';

      forbidden(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message
      });
    });

    test('notFound() should send 404 status with error response', () => {
      const message = 'Not found';

      notFound(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message
      });
    });

    test('conflict() should send 409 status with error response', () => {
      const message = 'Conflict';

      conflict(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message
      });
    });

    test('unprocessableEntity() should send 422 status with error array', () => {
      const errors = [{ field: 'email', message: 'Invalid email' }];

      unprocessableEntity(mockRes, errors);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        error: errors
      });
    });

    test('tooManyRequests() should send 429 status with error response', () => {
      const message = 'Too many requests';

      tooManyRequests(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message
      });
    });
  });

  describe('Server Error Responses', () => {
    test('internalServerError() should send 500 status with error response', () => {
      const message = 'Internal server error';

      internalServerError(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message
      });
    });

    test('serviceUnavailable() should send 503 status with error response', () => {
      const message = 'Service unavailable';

      serviceUnavailable(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(503);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message
      });
    });
  });

  describe('Default Messages', () => {
    test('should use default messages when not provided', () => {
      ok(mockRes, { data: 'test' });
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: { data: 'test' }
      });

      badRequest(mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Bad Request'
      });
    });
  });

  describe('Response Chaining', () => {
    test('response functions should return the response object', () => {
      const result = ok(mockRes, {}, 'Success');
      expect(result).toBe(mockRes);
    });
  });
});
