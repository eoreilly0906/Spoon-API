import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Mount protected API routes
router.use('/', authenticateToken, apiRoutes);

export default router;
