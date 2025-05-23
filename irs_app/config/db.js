import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env (adjust path if necessary)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Sequelize connection
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: (msg) => console.log(msg), // or use your logger here
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: '+05:30', // IST or change as needed
  }
);

// Test DB connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};


// Sync function to sync models with DB schema
export const sync = async ({ force = true, alter = true } = {}) => {
  try {
    // Import your models here (adjust path)
    await import('../models/user.js');
    await import('../models/issue.js');

    // Sync with options: force (drop tables), alter (update tables)
    await sequelize.sync({ force, alter });
    console.log('Database synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};
;
