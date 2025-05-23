import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // Invalid token
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token); // Extract payload without verifying
};
