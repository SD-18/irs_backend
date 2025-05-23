import express from 'express';
import { Sequelize } from 'sequelize';

const app = express();

// Basic database connection
const sequelize = new Sequelize('irs_system', 'root', 'virat', {
  host: 'localhost',
  dialect: 'mysql'
});

// Test database connection
async function testDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Unable to connect to database:', error);
    return false;
  }
}

// Start server
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server starting on port ${PORT}`);
  const dbConnected = await testDb();
  if (dbConnected) {
    console.log('Server is ready');
  } else {
    console.log('Server started but database connection failed');
  }
}); 