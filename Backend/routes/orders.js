import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

// GET single order by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Get order items
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        items: itemsResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST create new order
router.post('/', async (req, res, next) => {
  try {
    const { user_id, total_price, status, shipping_address, payment_method, notes, items } = req.body;

    if (!user_id || total_price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, total_price'
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total_price, status, shipping_address, payment_method, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user_id, total_price, status || 'pending', shipping_address, payment_method, notes]
      );

      const order = orderResult.rows[0];

      // Add order items if provided
      if (items && Array.isArray(items)) {
        for (const item of items) {
          await client.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price)
             VALUES ($1, $2, $3, $4)`,
            [order.id, item.product_id, item.quantity, item.price]
          );
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

// PUT update order
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, shipping_address, payment_method, notes } = req.body;

    const checkResult = await pool.query('SELECT id FROM orders WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    if (shipping_address !== undefined) {
      updates.push(`shipping_address = $${paramCount}`);
      values.push(shipping_address);
      paramCount++;
    }
    if (payment_method !== undefined) {
      updates.push(`payment_method = $${paramCount}`);
      values.push(payment_method);
      paramCount++;
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount}`);
      values.push(notes);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE order
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkResult = await pool.query('SELECT id FROM orders WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await pool.query('DELETE FROM orders WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
