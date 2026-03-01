import { Router } from 'express';
import authRoutes from './auth.js';
import healthRoutes from './health.js';

const router = Router();

// Mount auth routes at /api (register, login, me)
router.use('/', authRoutes);
// Mount health at /api/health
router.use('/', healthRoutes);

export default router;
