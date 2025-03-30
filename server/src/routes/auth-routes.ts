import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/index.js';  // Fixed import path
import jwt from 'jsonwebtoken';  // Import the JSON Web Token library
import bcrypt from 'bcrypt';  // Import the bcrypt library for password hashing

// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: number;
}

// Middleware to verify JWT token
const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: number, username: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get current user data
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'username', 'email']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return res.status(500).json({ message: 'Error fetching user data' });
  }
};

// Login function to authenticate a user
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;  // Extract username and password from request body
    console.log('Login attempt received:', { username, hasPassword: !!password });

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find the user in the database by username
    const user = await User.findOne({
      where: { username },
    });

    // If user is not found, send an authentication failed response
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    console.log('User found:', {
      id: user.id,
      username: user.username,
      email: user.email,
      hasPassword: !!user.password
    });

    console.log('Comparing passwords...');
    // Compare the provided password with the stored hashed password
    const passwordIsValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', passwordIsValid);
    
    // If password is invalid, send an authentication failed response
    if (!passwordIsValid) {
      console.log('Password validation failed');
      return res.status(401).json({ message: 'Authentication failed: Invalid password' });
    }

    // Get the secret key from environment variables
    const secretKey = process.env.JWT_SECRET || '';
    console.log('JWT_SECRET exists:', !!secretKey);

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ username, userId: user.id }, secretKey, { expiresIn: '1h' });
    console.log('Token generated successfully');
    
    // Return both token and user data
    return res.json({ 
      token,
      userId: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
};

// Create a new router instance
const router = Router();

// POST /login - Login a user
router.post('/login', login);  // Define the login route
router.get('/me', verifyToken, getCurrentUser);

export default router;  // Export the router instance
