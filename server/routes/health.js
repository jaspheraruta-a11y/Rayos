import { Router } from 'express';
import { getDb, DB_NAME, USERS_COLLECTION } from '../db.js';

const router = Router();

// GET /api/health — server and DB status
router.get('/health', (_, res) => {
  const db = getDb();
  res.json({
    ok: true,
    db: !!db,
    database: DB_NAME,
    collection: USERS_COLLECTION,
  });
});

export default router;
