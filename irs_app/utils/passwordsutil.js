import bcrypt from 'bcrypt';

// Function to hash a password
export const hashPassword = async (password) => {
  const saltRounds = 10; // Number of salt rounds for bcrypt
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

// Function to compare a plain text password with a hashed password
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};