import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/connection.js';
import { signToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const client = await pool.connect();
    try {
      const existing = await client.query('SELECT id FROM users WHERE email=$1', [email]);
      if (existing.rows.length) return res.status(409).json({ error: 'User already exists' });
      const hash = await bcrypt.hash(password, 10);
      const result = await client.query(
        `INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
         VALUES ($1,$2,$3,$4,NOW(),NOW()) RETURNING id, name, email, role`,
        [name || null, email, hash, role]
      );
      const user = result.rows[0];
      const token = signToken(user);
      res.json({ token, user });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT id, name, email, password_hash, role FROM users WHERE email=$1', [email]);
      if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });
      const u = result.rows[0];
      const ok = await bcrypt.compare(password, u.password_hash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const user = { id: u.id, name: u.name, email: u.email, role: u.role };
      const token = signToken(user);
      res.json({ token, user });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
