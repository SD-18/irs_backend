import { User } from '../models/user.js';
import logger from '../utils/logger.js';
import { hashPassword } from '../utils/passwordsutil.js';

export const registerUser = async (username, password) => {
  try {
    // Determine role based on username pattern
    const rollNoRegex = /^DC\d{4}[A-Z]{3}\d{4}$/;
    const role = rollNoRegex.test(username) ? 'student' : 'teacher';

    // Validate username format for students
    if (role === 'student' && !rollNoRegex.test(username)) {
      throw new Error('Invalid roll number format.');
    }

    // Validate username format for teachers
    if (role === 'teacher' && username.length < 6) {
      throw new Error('Name must be at least 6 characters long');
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password using passwordsutil
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      role,
      password: hashedPassword
    });

    return user;
  } catch (error) {
    logger.error('Error registering user:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role']
    });
    return users;
  } catch (error) {
    logger.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ role: newRole });
    return user;
  } catch (error) {
    logger.error(`Error updating user ${userId} role:`, error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
    return true;
  } catch (error) {
    logger.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};
