import { Sequelize } from 'sequelize';
import dbConfig from './database.js';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    dialectOptions: config.dialectOptions
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`\x1b[34m✅ Database connection established successfully.\x1b[0m`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

export { sequelize, testConnection };
