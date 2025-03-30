import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the interface for the JWT payload
interface JwtPayload {
  username: string;
  userId: number;
}

// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: number;
}

// Middleware function to authenticate JWT token
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (authHeader) {
    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1];

    // Get the secret key from the environment variables
    const secretKey = process.env.JWT_SECRET || '';

    // Verify the JWT token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Send forbidden status if the token is invalid
      }

      // Attach the user ID to the request object
      req.userId = (decoded as JwtPayload).userId;
      return next(); // Call the next middleware function
    });
  } else {
    res.sendStatus(401); // Send unauthorized status if no authorization header is present
  }
};
