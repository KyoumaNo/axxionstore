import express from 'express';
import { pool } from '../db/connection.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT id, name, email, role, phone, country, avatar, created_at FROM users WHERE id=$1', [req.user.id]);
      if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
      res.json({ user: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Get user error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
