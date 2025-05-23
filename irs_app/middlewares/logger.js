import logger from '../utils/logger.js';

export const logRequest = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
};

export const authLogger = (req, res, next) => {
  logger.info('Authentication attempt', {
    ip: req.ip,
    path: req.path,
    method: req.method,
    username: req.body.username
  });
  next();
}; 