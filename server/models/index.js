import { sequelize } from '../config/sequelize.js';
import User from './User.js';

// Initialize all models
const models = {
  User
};

// Sync database (only in development)
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
  }
};

export {
  sequelize,
  User,
  syncDatabase
};

