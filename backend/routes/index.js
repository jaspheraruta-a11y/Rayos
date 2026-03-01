import { Router } from 'express';
import authRoutes from './auth.js';
import healthRoutes from './health.js';
// Route map (CodeIgniter-style): see routes.config.js for API_ROUTES

const router = Router();

// Mount auth routes at /api → POST /register, POST /login, GET /me
router.use('/', authRoutes);
// Mount health at /api → GET /health
router.use('/', healthRoutes);

export default router;
