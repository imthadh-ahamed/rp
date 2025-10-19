import { sequelize } from '../config/sequelize.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} Created user and token
   */
  async register(userData) {
    const { firstName, lastName, email, password } = userData;

    // Check if user already exists using raw SQL
    const [existingUsers] = await sequelize.query(
      'SELECT id, email FROM users WHERE email = :email LIMIT 1',
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (existingUsers) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user using raw SQL
    const [result] = await sequelize.query(
      `INSERT INTO users (id, first_name, last_name, email, password, is_active, created_at, updated_at) 
       VALUES (gen_random_uuid(), :firstName, :lastName, :email, :password, true, NOW(), NOW()) 
       RETURNING id, first_name as "firstName", last_name as "lastName", email, is_active as "isActive", created_at as "createdAt"`,
      {
        replacements: { 
          firstName, 
          lastName, 
          email, 
          password: hashedPassword 
        },
        type: sequelize.QueryTypes.INSERT
      }
    );

    const user = result[0];

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    return { user, token };
  }

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Object} User and token
   */
  async login(email, password) {
    // Find user by email using raw SQL
    const [user] = await sequelize.query(
      'SELECT id, first_name as "firstName", last_name as "lastName", email, password, is_active as "isActive", last_login as "lastLogin" FROM users WHERE email = :email LIMIT 1',
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login using raw SQL
    await sequelize.query(
      'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = :userId',
      {
        replacements: { userId: user.id },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    return { user, token };
  }

  /**
   * Get user profile
   * @param {String} userId - User ID
   * @returns {Object} User profile
   */
  async getProfile(userId) {
    // Get user by ID using raw SQL
    const [user] = await sequelize.query(
      'SELECT id, first_name as "firstName", last_name as "lastName", email, is_active as "isActive", last_login as "lastLogin", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = :userId LIMIT 1',
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export default new AuthService();
