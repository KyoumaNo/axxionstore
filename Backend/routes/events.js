import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

// GET /api/events - return all events ordered by newest first
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, type, content, created_at FROM events ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/events - create new event
router.post('/', async (req, res) => {
  const { title, type, content } = req.body;

  // Validate required fields
  if (!title || !type || !content) {
    return res.status(400).json({ error: 'title, type, and content are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO events (title, type, content) VALUES ($1, $2, $3) RETURNING id, title, type, content, created_at',
      [title, type, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// DELETE /api/events/:id - delete event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
