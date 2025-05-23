import Issue from '../models/issue.js';
import logger from '../utils/logger.js';

const VALID_STATUSES = ['open', 'in-progress', 'resolved'];

export async function createIssue(data, createdBy) {
  try {
    logger.debug(`Creating issue for user ${createdBy}`, { 
      title: data.title,
      status: data.status || 'open' 
    });

    const issue = await Issue.create({ ...data, createdBy });
    
    logger.info(`Issue created successfully`, {
      issueId: issue.id,
      createdBy,
      status: issue.status
    });

    return issue;
  } catch (error) {
    logger.error(`Failed to create issue for user ${createdBy}`, {
      error: error.message,
      stack: error.stack,
      inputData: { 
        title: data.title,
        description: data.description?.length > 50 ? 
          data.description.substring(0, 50) + '...' : data.description
      }
    });
    throw error;
  }
}

export async function getAllIssues() {
  try {
    logger.debug(`Fetching all issues for admin`);

    const issues = await Issue.findAll();

    logger.info(`Retrieved ${issues.length} issues for admin`);
    return issues;
  } catch (error) {
    logger.error(`Failed to fetch all issues for admin`, {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export async function getUserIssues(createdBy) {
  try {
    logger.debug(`Fetching issues for user ${createdBy}`);

    const issues = await Issue.findAll({ where: { createdBy } });

    logger.info(`Retrieved ${issues.length} issues for user ${createdBy}`);
    return issues;
  } catch (error) {
    logger.error(`Failed to fetch issues for user ${createdBy}`, {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export async function updateIssueStatus(id, status, userId) {
  try {
    if (!VALID_STATUSES.includes(status)) {
      logger.warn(`Invalid status update attempt by user ${userId}: ${status}`);
      throw new Error('Invalid status');
    }

    logger.debug(`Attempting to update issue ${id} status to ${status}`);

    const issue = await Issue.findByPk(id);
    if (!issue) {
      logger.warn(`Issue not found: ${id}`);
      throw new Error('Issue not found');
    }

    if (issue.status === status) {
      logger.info(`No change in status for issue ${id}, skipping update`);
      return issue;
    }

    const previousStatus = issue.status;
    await issue.update({ status });

    logger.info(`Issue status updated`, {
      issueId: id,
      from: previousStatus,
      to: status,
      changedBy: userId
    });

    return issue;
  } catch (error) {
    logger.error(`Failed to update issue ${id} status`, {
      error: error.message,
      stack: error.stack,
      attemptedStatus: status
    });
    throw error;
  }
}

export async function deleteIssue(id, userRole, userId) {
  try {
    logger.debug(`User ${userId} (${userRole}) attempting to delete issue ${id}`);

    if (userRole !== 'admin') {
      logger.warn(`Unauthorized delete attempt by user ${userId}`);
      throw new Error('Permission denied');
    }

    const issue = await Issue.findByPk(id);
    if (!issue) {
      logger.warn(`Issue not found: ${id}`);
      throw new Error('Issue not found');
    }

    await issue.destroy();
    logger.info(`Issue ${id} deleted by admin ${userId}`);
    return { message: 'Issue deleted successfully' };
  } catch (error) {
    logger.error(`Failed to delete issue ${id}`, {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
