import { User } from './user.js';
import { Issue } from './issue.js';

// User-Issue associations
User.hasMany(Issue, { foreignKey: 'createdBy' });
Issue.belongsTo(User, { foreignKey: 'createdBy' });

export { User, Issue}; 