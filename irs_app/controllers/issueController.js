import { createIssue as createIssueService, 
  getUserIssues as getUserIssuesService, 
  getAllIssues as getAllIssuesService, 
  updateIssueStatus as updateIssueStatusService,
  deleteIssue as issuedelete } from '../services/issueService.js';
import logger from '../utils/logger.js';



// Create a new issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const createdBy = req.user.id;

    const issue = await createIssueService({ title, description, location, category}, createdBy);
    res.status(201).json(issue);
  } catch (error) {
    logger.error('Error creating issue:', error);
    res.status(500).json({ message: 'Error creating issue' });
  }
};

// Get all issues for the admin
export const getAllIssues = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const issues = await getAllIssuesService();
    res.json(issues);
  } catch (error) {
    logger.error('Error fetching all issues:', error);
    res.status(500).json({ message: 'Error fetching all issues' });
  }
};

// Get issues reported by the current user
export const getUserIssues = async (req, res) => {
  try {
    const userId = req.user.id;
    const issues = await getUserIssuesService(userId);
    res.json(issues);
  } catch (error) {
    logger.error('Error fetching user issues:', error);
    res.status(500).json({ message: 'Error fetching user issues' });
  }
};



// Update issue status (admin only)
export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 
     const userId = req.user?.id;

    const issue = await updateIssueStatusService(id, status,userId);

    res.json(issue);
  } catch (error) {
    logger.error('Error updating issue status:', error);
    res.status(500).json({ message: 'Error updating issue status' });
  }
};

// Delete an issue (admin only)
export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const result = await issuedelete(id, userRole, userId);
    res.json(result);
  } catch (error) {
    logger.error('Error deleting issue:', error);
    res.status(500).json({ message: 'Error deleting issue' });
  }
};
