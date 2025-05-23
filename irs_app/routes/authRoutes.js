import express from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/authController.js';
import validate from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/auth.js';
import { authLogger } from '../middlewares/logger.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Rate limiting for auth endpoints
router.use(authLimiter);

// Logging middleware for auth routes
router.use(authLogger);

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Login route for user and admin
router.post('/login', loginValidation, validate, login);

// Route not found handler
router.use((req, res) => {
  logger.warn(`Auth route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  res.status(404).json({ error: 'Route not found' });
});

export default router;