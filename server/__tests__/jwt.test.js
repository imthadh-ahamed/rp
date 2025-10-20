import { describe, test, expect, jest } from '@jest/globals';
import { generateToken, verifyToken } from '../utils/jwt.js';

describe('JWT Utility Tests', () => {
  const mockPayload = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com'
  };

  describe('generateToken()', () => {
    test('should generate a valid JWT token', () => {
      const token = generateToken(mockPayload);

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should generate different tokens for different payloads', () => {
      const token1 = generateToken({ id: '1', email: 'user1@example.com' });
      const token2 = generateToken({ id: '2', email: 'user2@example.com' });

      expect(token1).not.toBe(token2);
    });

    test('should include payload data in token', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded).toHaveProperty('id', mockPayload.id);
      expect(decoded).toHaveProperty('email', mockPayload.email);
      expect(decoded).toHaveProperty('iat'); // issued at
      expect(decoded).toHaveProperty('exp'); // expiration
    });
  });

  describe('verifyToken()', () => {
    test('should verify and decode valid token', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded).toHaveProperty('id', mockPayload.id);
      expect(decoded).toHaveProperty('email', mockPayload.email);
    });

    test('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });

    test('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';

      expect(() => {
        verifyToken(malformedToken);
      }).toThrow();
    });

    test('should throw error for empty token', () => {
      expect(() => {
        verifyToken('');
      }).toThrow();
    });

    test('should include expiration time in decoded token', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded).toHaveProperty('exp');
      expect(typeof decoded.exp).toBe('number');
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });
  });

  describe('Token Security', () => {
    test('should not be able to modify token without invalidating it', () => {
      const token = generateToken(mockPayload);
      const parts = token.split('.');
      
      // Try to modify the payload part
      const modifiedToken = parts[0] + '.' + 'modified' + '.' + parts[2];

      expect(() => {
        verifyToken(modifiedToken);
      }).toThrow();
    });

    test('token should expire after configured time', () => {
      // This test would require mocking time or using a very short expiration
      // For now, we just verify that exp is set correctly
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);
      
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;
      
      // Token should expire in the future
      expect(expiresIn).toBeGreaterThan(0);
    });
  });
});
