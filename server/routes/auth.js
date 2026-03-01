import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// POST /api/register — save new user to MongoDB
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const users = getUsersCollection();
    const existing = await users.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    const doc = {
      email: email.trim().toLowerCase(),
      passwordHash,
      createdAt: now,
      updatedAt: now,
      verified: false,
      role: 'user',
    };
    if (username != null && String(username).trim() !== '') {
      doc.username = String(username).trim();
    }
    const result = await users.insertOne(doc);
    const user = {
      id: result.insertedId.toString(),
      email: doc.email,
      username: doc.username,
      createdAt: doc.createdAt,
    };
    res.status(201).json({ user, message: 'Account created successfully' });
  } catch (err) {
    console.error('Register error:', err);
    if (err.message === 'Database not connected') {
      return res.status(503).json({
        error: 'Database not connected. Check that MongoDB is running and the server connected.',
      });
    }
    const message =
      err.code === 11000
        ? 'An account with this email or username already exists'
        : err.message || 'Registration failed';
    res.status(500).json({ error: message });
  }
});

// POST /api/login — verify password and return JWT + user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const users = getUsersCollection();
    const u = await users.findOne({ email: email.trim().toLowerCase() });
    if (!u) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, u.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const now = new Date();
    await users.updateOne(
      { _id: u._id },
      { $set: { updatedAt: now } }
    );
    const user = {
      id: u._id.toString(),
      email: u.email,
      username: u.username,
      created_at: u.createdAt,
      last_sign_in_at: now,
    };
    const token = jwt.sign(
      { sub: u._id.toString(), email: u.email },
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
  try {
    const auth = req.headers.authorization;
    const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = getUsersCollection();
    const u = await users.findOne({ _id: new ObjectId(decoded.sub) });
    if (!u) {
      return res.status(401).json({ error: 'User not found' });
    }
    const user = {
      id: u._id.toString(),
      email: u.email,
      username: u.username,
      created_at: u.createdAt,
      last_sign_in_at: u.updatedAt,
    };
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
