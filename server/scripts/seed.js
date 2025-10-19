import dotenv from 'dotenv';
import { User, sequelize } from '../models/index.js';

dotenv.config();

/**
 * Seed database with initial data
 */
async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Create sample users
    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@aspireai.com',
        password: 'admin123'
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123'
      }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
