import { Router } from 'express';
import { DB_NAME, getPool, USERS_TABLE } from '../db.js';

const router = Router();

// GET /api/health — backend and DB status
router.get('/health', async (_, res) => {
  try {
    const pool = getPool();
    // Test the connection
    await pool.query('SELECT NOW()');
    res.json({
      ok: true,
      db: true,
      database: DB_NAME,
      table: USERS_TABLE,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      db: false,
      error: err.message,
    });
  }
});

export default router;
