import express from 'express';
import { register, getAllUsers, updateUserRole } from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { logRequest } from '../middlewares/logger.js';
import { param, body } from 'express-validator';
import logger from '../utils/logger.js';

const router = express.Router();

// Apply logging middleware to all user routes
router.use(logRequest);

// Public route to register a user
router.post('/register', register);

// Admin-only route to get all users
router.get('/', authenticate, authorize(['admin']), getAllUsers);

// Admin-only route to update a user's role
router.patch('/:id/role',
  authenticate,
  authorize(['admin']),
  [
    param('id').isInt().withMessage('User ID must be an integer'),
    body('role')
      .isIn(['admin', 'teacher', 'student'])
      .withMessage('Role must be admin, teacher, or student')
  ],
  updateUserRole
);

// 404 handler for user routes
router.use((req, res) => {
  logger.warn(`User route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    user: req.user?.id
  });
  res.status(404).json({ error: 'User endpoint not found' });
});

export default router;