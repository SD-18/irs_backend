import { User } from '../models/user.js';
import logger from '../utils/logger.js';
import { login as loginService } from '../services/authService.js';

// Login controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const {token, user} = await loginService(username, password);

    logger.info(`User logged in successfully`, {
      username
    });

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get current user controller
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'role']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({ error: error.message });
  }
};
