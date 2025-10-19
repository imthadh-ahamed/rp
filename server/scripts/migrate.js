import { sequelize } from '../config/sequelize.js';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const umzug = new Umzug({
  migrations: {
    glob: ['../migrations/*.js', { cwd: __dirname }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // List pending migrations
    const pending = await umzug.pending();
    console.log('📋 Pending migrations:', pending.map(m => m.name));

    // Run pending migrations
    const migrations = await umzug.up();
    
    if (migrations.length === 0) {
      console.log('✅ No pending migrations.');
    } else {
      console.log('✅ Migrations completed successfully:');
      migrations.forEach((migration) => {
        console.log(`   - ${migration.name}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
