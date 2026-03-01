import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { getPool } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// POST /api/register — save new user to PostgreSQL
router.post('/register', async (req, res) => {
  const pool = getPool();
  try {
    const { email, password, username } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailLower = email.trim().toLowerCase();
    
    // Check if user already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [emailLower]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (email, username, password_hash, created_at, updated_at, verified, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, username, created_at`,
      [
        emailLower,
        username && String(username).trim() !== '' ? String(username).trim() : null,
        passwordHash,
        now,
        now,
        false,
        'user'
      ]
    );

    const user = {
      id: result.rows[0].id,
      email: result.rows[0].email,
      username: result.rows[0].username,
      createdAt: result.rows[0].created_at,
    };

    res.status(201).json({ user, message: 'Account created successfully' });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === '23505') {
      // Unique constraint violation
      return res.status(400).json({ error: 'An account with this email or username already exists' });
    }
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// POST /api/login — verify password and return JWT + user
router.post('/login', async (req, res) => {
  const pool = getPool();
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailLower = email.trim().toLowerCase();

    // Find user
    const result = await pool.query(
      'SELECT id, email, username, password_hash, created_at FROM users WHERE email = $1',
      [emailLower]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const u = result.rows[0];

    // Verify password
    const valid = await bcrypt.compare(password, u.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const now = new Date();

    // Update last login
    await pool.query(
      'UPDATE users SET updated_at = $1 WHERE id = $2',
      [now, u.id]
    );

    const user = {
      id: u.id,
      email: u.email,
      username: u.username,
      created_at: u.created_at,
      last_sign_in_at: now,
    };

    const token = jwt.sign(
      { sub: u.id, email: u.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/me — return current user from JWT (optional, for session restore)
router.get('/me', async (req, res) => {
  const pool = getPool();
  try {
    const auth = req.headers.authorization;
    const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await pool.query(
      'SELECT id, email, username, created_at, updated_at FROM users WHERE id = $1',
      [decoded.sub]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const u = result.rows[0];
    const user = {
      id: u.id,
      email: u.email,
      username: u.username,
      created_at: u.created_at,
      last_sign_in_at: u.updated_at,
    };

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
