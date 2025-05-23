import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize, testConnection } from './config/db.js';
import logger from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import userRoutes from './routes/userRoutes.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import './models/associations.js';
import { User } from './models/user.js';
import { authenticate, authorize } from './middlewares/auth.js';
import { logRequest, authLogger } from './middlewares/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create necessary directories
const logsDir = join(__dirname, 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  logger.info(`Directory created: ${logsDir}`);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Logging middleware
app.use(logRequest);
app.use('/api/users', authLogger);

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'IRS API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const startServer = async () => {
  try {
    console.log('Starting server...');
    console.log('Environment variables:', {
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      PORT: process.env.PORT
    });
    
    // Test database connection
    await testConnection();
    
    // Sync database
    console.log('Syncing database...');
    await sequelize.sync({ alter: false });
    console.log('Database synced');

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Available endpoints:');
      console.log('- GET /health');
      console.log('- GET /');
      console.log('- POST /api/auth/register');
      console.log('- POST /api/auth/login');
      console.log('- GET /api/issues');
      console.log('- POST /api/issues');
      console.log('- GET /api/users');
    });
  } catch (error) {
    console.error('Server startup error:', error);
    logger.error('Server startup error:', error);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled Rejection:', { promise, reason });
  process.exit(1);
});
// Start the server
startServer();
