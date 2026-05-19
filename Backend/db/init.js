import pool from './connection.js';

export async function initializeDatabase() {
  try {
    // Create Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url VARCHAR(500),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

      // users table for authentication
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          phone TEXT,
          country TEXT,
          avatar TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // events table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // seed single admin account if it doesn't exist
      const adminEmail = process.env.ADMIN_EMAIL || 'adminaxxion@axxion.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'adminaxxion2026';
      const adminCheck = await pool.query('SELECT id FROM users WHERE email=$1', [adminEmail]);
      if (!adminCheck.rows.length) {
        const bcrypt = await import('bcrypt');
        const hash = await bcrypt.hash(adminPassword, 10);
        await pool.query(
          `INSERT INTO users (name,email,password_hash,role,created_at,updated_at) VALUES ($1,$2,$3,$4,NOW(),NOW())`,
          ['Admin', adminEmail, hash, 'admin']
        );
        console.log('Seeded admin user:', adminEmail);
      }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

export async function closeDatabase() {
  await pool.end();
  console.log('Database connection closed');
}
