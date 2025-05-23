import User from '../models/user.js';
import { generateToken } from '../utils/jwt.js';
import { comparePassword } from '../utils/passwordsutil.js';
import logger from '../utils/logger.js';

export async function login(username, password) {
  try {
    logger.debug(`Login attempt initiated for username: ${username}`);

    // Find existing user
    let user = await User.findOne({ where: { username } });
    logger.debug(user ? 'User found in database' : 'No existing user found');

    // Prevent automatic user creation for security reasons
    if (!user) {
      throw new Error('User not found. Please sign up.');
    }

    // Verify password for admin
    if (user.role === 'admin' && user.password) {
      logger.debug('Admin login attempt - verifying password');
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        logger.warn(`Failed admin login attempt for username: ${username}`);
        throw new Error('Invalid credentials');
      }
      logger.debug('Admin password verification successful');
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    logger.debug(`Generating JWT for user ID: ${user.id}`);
    const token = generateToken(tokenPayload);
    
    logger.info(`Successful login for ${user.role} ${username} (ID: ${user.id})`);
    return {token, user: tokenPayload};

  } catch (error) {
    logger.error(`Login failed for ${username}: ${error.message}`, {
      stack: error.stack,
      username
    });
    throw error; // Re-throw for controller handling
  }
}
