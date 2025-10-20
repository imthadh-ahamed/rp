import { describe, test, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import routes from '../routes/index.js';
import errorHandler from '../middlewares/errorHandler.js';
import { setupTestDB, cleanupTestDB, closeTestDB, createTestUser } from './helpers/testSetup.js';

// Load environment variables
dotenv.config();

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use(errorHandler);

describe('Auth API Endpoints', () => {
  // Setup database connection before all tests
  beforeAll(async () => {
    await setupTestDB();
  });

  // Clean up after each test
  afterEach(async () => {
    await cleanupTestDB();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await closeTestDB();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = await createTestUser();

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', userData.email);
      expect(response.body.data.user).toHaveProperty('firstName', userData.firstName);
      expect(response.body.data.user).toHaveProperty('lastName', userData.lastName);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    test('should fail to register with existing email', async () => {
      const userData = await createTestUser();

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'User with this email already exists');
    });

    test('should fail to register without required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
          // Missing firstName, lastName, password
        })
        .expect(422);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBeInstanceOf(Array);
      expect(response.body.error.length).toBeGreaterThan(0);
    });

    test('should fail to register with invalid email', async () => {
      const userData = await createTestUser({ email: 'invalid-email' });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(422);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBeInstanceOf(Array);
    });

    test('should fail to register with short password', async () => {
      const userData = await createTestUser({ password: '12345' });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(422);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login successfully with valid credentials', async () => {
      const userData = await createTestUser();

      // First register the user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', userData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    test('should fail to login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    test('should fail to login with incorrect password', async () => {
      const userData = await createTestUser();

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to login with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    test('should fail to login without email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        })
        .expect(422);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBeInstanceOf(Array);
    });

    test('should fail to login without password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        })
        .expect(422);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/auth/profile', () => {
    test('should get user profile with valid token', async () => {
      const userData = await createTestUser();

      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const token = registerResponse.body.data.token;

      // Get profile
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Profile fetched successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('email', userData.email);
      expect(response.body.data.user).toHaveProperty('firstName', userData.firstName);
      expect(response.body.data.user).toHaveProperty('lastName', userData.lastName);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    test('should fail to get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('should fail to get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    test('should fail to get profile with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Health Check Endpoint', () => {
    test('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Server is running');
    });
  });
});
