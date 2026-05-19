import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

// GET all events
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

// GET single event by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST create new event
router.post('/', async (req, res, next) => {
  try {
    const { title, type, content } = req.body;

    if (!title || !type || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, type, content'
      });
    }

    const result = await pool.query(
      `INSERT INTO events (title, type, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, type, content]
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE event
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkResult = await pool.query('SELECT id FROM events WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await pool.query('DELETE FROM events WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
