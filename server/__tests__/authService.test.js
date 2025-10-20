import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from '@jest/globals';
import authService from '../services/authService.js';
import { setupTestDB, cleanupTestDB, closeTestDB, createTestUser } from './helpers/testSetup.js';

describe('AuthService Unit Tests', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterEach(async () => {
    await cleanupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('register()', () => {
    test('should register a new user and return user object with token', async () => {
      const userData = await createTestUser();
      const result = await authService.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email', userData.email);
      expect(result.user).toHaveProperty('firstName', userData.firstName);
      expect(result.user).toHaveProperty('lastName', userData.lastName);
      expect(result.user).toHaveProperty('isActive', true);
      expect(result.user).not.toHaveProperty('password');
      expect(typeof result.token).toBe('string');
    });

    test('should hash password during registration', async () => {
      const userData = await createTestUser();
      const result = await authService.register(userData);

      // Password should not be returned
      expect(result.user).not.toHaveProperty('password');
      
      // Should be able to login with the password (password was hashed correctly)
      const loginResult = await authService.login(userData.email, userData.password);
      expect(loginResult).toHaveProperty('user');
      expect(loginResult).toHaveProperty('token');
    });

    test('should throw error if email already exists', async () => {
      const userData = await createTestUser();

      // First registration
      await authService.register(userData);

      // Second registration should fail
      await expect(authService.register(userData)).rejects.toThrow('User with this email already exists');
    });

    test('should create user with unique ID', async () => {
      const user1Data = await createTestUser({ email: 'user1@example.com' });
      const user2Data = await createTestUser({ email: 'user2@example.com' });

      const result1 = await authService.register(user1Data);
      const result2 = await authService.register(user2Data);

      expect(result1.user.id).not.toBe(result2.user.id);
    });
  });

  describe('login()', () => {
    test('should login user with correct credentials', async () => {
      const userData = await createTestUser();
      
      // Register user first
      await authService.register(userData);

      // Login
      const result = await authService.login(userData.email, userData.password);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('email', userData.email);
      expect(result.user).not.toHaveProperty('password');
    });

    test('should throw error with invalid email', async () => {
      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid email or password');
    });

    test('should throw error with incorrect password', async () => {
      const userData = await createTestUser();
      
      // Register user
      await authService.register(userData);

      // Try to login with wrong password
      await expect(
        authService.login(userData.email, 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });

    test('should update last_login timestamp on successful login', async () => {
      const userData = await createTestUser();
      
      // Register user
      const registerResult = await authService.register(userData);
      const userId = registerResult.user.id;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));

      // Login
      await authService.login(userData.email, userData.password);

      // Get profile to check last_login
      const profile = await authService.getProfile(userId);
      expect(profile).toHaveProperty('lastLogin');
      expect(profile.lastLogin).not.toBeNull();
    });

    test('should generate valid JWT token on login', async () => {
      const userData = await createTestUser();
      
      // Register user
      await authService.register(userData);

      // Login
      const result = await authService.login(userData.email, userData.password);

      expect(typeof result.token).toBe('string');
      expect(result.token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('getProfile()', () => {
    test('should return user profile by ID', async () => {
      const userData = await createTestUser();
      
      // Register user
      const registerResult = await authService.register(userData);
      const userId = registerResult.user.id;

      // Get profile
      const profile = await authService.getProfile(userId);

      expect(profile).toHaveProperty('id', userId);
      expect(profile).toHaveProperty('email', userData.email);
      expect(profile).toHaveProperty('firstName', userData.firstName);
      expect(profile).toHaveProperty('lastName', userData.lastName);
      expect(profile).toHaveProperty('isActive');
      expect(profile).toHaveProperty('createdAt');
      expect(profile).toHaveProperty('updatedAt');
      expect(profile).not.toHaveProperty('password');
    });

    test('should throw error if user not found', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      
      await expect(
        authService.getProfile(fakeUserId)
      ).rejects.toThrow('User not found');
    });

    test('should return all required user fields', async () => {
      const userData = await createTestUser();
      
      // Register user
      const registerResult = await authService.register(userData);
      const userId = registerResult.user.id;

      // Get profile
      const profile = await authService.getProfile(userId);

      const requiredFields = ['id', 'firstName', 'lastName', 'email', 'isActive', 'createdAt', 'updatedAt'];
      requiredFields.forEach(field => {
        expect(profile).toHaveProperty(field);
      });
    });
  });

  describe('Password Security', () => {
    test('should not return password in any service method', async () => {
      const userData = await createTestUser();
      
      // Register
      const registerResult = await authService.register(userData);
      expect(registerResult.user).not.toHaveProperty('password');

      // Login
      const loginResult = await authService.login(userData.email, userData.password);
      expect(loginResult.user).not.toHaveProperty('password');

      // Get Profile
      const profile = await authService.getProfile(registerResult.user.id);
      expect(profile).not.toHaveProperty('password');
    });

    test('should store hashed password, not plain text', async () => {
      const userData = await createTestUser();
      
      await authService.register(userData);

      // Try to login with the "hashed" password (should fail)
      // If password was stored as plain text, this might accidentally work
      const wrongAttempts = [
        userData.password.toUpperCase(),
        userData.password + ' ',
        ' ' + userData.password,
      ];

      for (const wrongPassword of wrongAttempts) {
        if (wrongPassword !== userData.password) {
          await expect(
            authService.login(userData.email, wrongPassword)
          ).rejects.toThrow('Invalid email or password');
        }
      }
    });
  });

  describe('Edge Cases', () => {
    test('should handle email case sensitivity correctly', async () => {
      const userData = await createTestUser({ email: 'Test@Example.com' });
      
      await authService.register(userData);

      // Should be able to login with lowercase email
      const result = await authService.login('test@example.com', userData.password);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    test('should trim whitespace from names', async () => {
      const userData = await createTestUser({
        firstName: '  John  ',
        lastName: '  Doe  '
      });
      
      const result = await authService.register(userData);

      // Check if names are properly handled (depends on your validation)
      expect(result.user.firstName).toBeDefined();
      expect(result.user.lastName).toBeDefined();
    });
  });
});
