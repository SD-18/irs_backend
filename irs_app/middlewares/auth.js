import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import logger from '../utils/logger.js';
import rateLimit from 'express-rate-limit';

// Rate limiter for failed auth attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 failed attempts
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`, {
      path: req.path,
      headers: req.headers
    });
    return res.status(429).json({ 
      error: 'Too many failed attempts. Try again later.' 
    });
  }
});

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = { id: user.id, role: user.role }; // Ensure role is included in req.user
    next();
  } catch (error) {
    logger.error('Authentication error', { error });
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    // Only check authorization for admin routes
    if (roles.includes('admin')) {
      if (!req.user) {
        logger.warn('Unauthorized access attempt - no user', { ip: req.ip });
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!roles.includes(req.user.role)) {
        logger.warn(`Unauthorized access attempt by ${req.user.role}`, {
          ip: req.ip,
          userId: req.user.id,
          requiredRoles: roles
        });
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    next();
  };
}; 

export { authLimiter };