import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/auth.js';
import { createIssue, getUserIssues, updateIssueStatus, getAllIssues, deleteIssue } from '../controllers/issueController.js';

const router = express.Router();

// Route to create an issue
router.post('/', authenticate, createIssue);

// Updated route to get all issues for the admin with authorize middleware
router.get('/', authenticate, authorize(['admin']), getAllIssues);

// Route to get all issues for a specific user
router.get('/user', authenticate, getUserIssues);

// Updated route to update the status of an issue by the admin with authorize middleware
router.patch('/:id/status', authenticate, authorize(['admin']), updateIssueStatus);

// Route to delete an issue (admin only)
router.delete('/:id', authenticate, authorize(['admin']), deleteIssue);

export default router;