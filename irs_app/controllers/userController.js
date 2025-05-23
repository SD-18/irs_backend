import { getAllUsers as getAllUsersService, 
  updateUserRole as updateUserRoleService, 
  deleteUser as deleteUserService, 
  registerUser as registerUserService } 
  from '../services/userService.js';
import logger from '../utils/logger.js';



// Register user
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await registerUserService(username, password);

    logger.info(`User created successfully`, {
      userId: user.id,
      role: user.role
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'Username already exists') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};



// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['admin', 'teacher', 'student'].includes(role)) {
      logger.warn(`Invalid role update attempt: ${role}`);
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await updateUserRoleService(id, role);

    logger.info(`User role updated by admin ${req.user.id}`, {
      userId: id,
      newRole: role
    });

    res.json({
      message: 'User role updated successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Error updating user role:', error);
    res.status(500).json({ error: 'Error updating user role' });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user.id) {
      logger.warn(`Admin ${req.user.id} attempted to delete their own account`);
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await deleteUserService(id);

    logger.info(`User deleted by admin ${req.user.id}`, {
      deletedUserId: id
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};


