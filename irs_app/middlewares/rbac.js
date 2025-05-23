import logger from '../utils/logger.js';

export default (allowedRoles = []) => {
  return (req, res, next) => {
    // Skip for health checks
    if (req.path === '/health') return next();

    // Verify user is authenticated
    if (!req.user?.role) {
      return res.status(403).json({ error: 'Authentication required' });
    }

    // Allow access if no specific roles are required
    if (allowedRoles.length === 0) return next();

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user.role} ${req.user.id}`);
      return res.status(403).json({ 
        error: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};
