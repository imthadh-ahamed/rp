import { sequelize } from '../../config/sequelize.js';

/**
 * Setup test database connection
 */
export async function setupTestDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
    throw error;
  }
}

/**
 * Cleanup test database
 */
export async function cleanupTestDB() {
  try {
    // Clean up users table
    await sequelize.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    console.log('✅ Test database cleaned');
  } catch (error) {
    console.error('❌ Test database cleanup failed:', error);
  }
}

/**
 * Close database connection
 */
export async function closeTestDB() {
  try {
    await sequelize.close();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Failed to close test database connection:', error);
  }
}

/**
 * Create test user helper
 */
export async function createTestUser(userData = {}) {
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    ...userData
  };

  return defaultUser;
}
