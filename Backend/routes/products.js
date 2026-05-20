const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM products ORDER BY id DESC'
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

router.post('/', async (req, res) => {

    try {

        const {
            title,
            description,
            price,
            image,
            category
        } = req.body;

        await pool.query(
            `
            INSERT INTO products
            (title, description, price, image, category)
            VALUES ($1,$2,$3,$4,$5)
            `,
            [title, description, price, image, category]
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;
