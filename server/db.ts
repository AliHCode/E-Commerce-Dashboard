import { Pool } from 'pg';

// Only load dotenv in local development — Vercel injects env vars natively
if (!process.env.VERCEL) {
  try {
    // Use require() instead of top-level await, which Vercel doesn't support
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
  } catch {
    // dotenv may not be available in some environments
  }
}

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : undefined
});

let isInitialized = false;

export const initDb = async () => {
  if (isInitialized) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        location VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Active',
        avatar TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(255) UNIQUE NOT NULL,
        stock INTEGER DEFAULT 0,
        price VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'In Stock'
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        customer_id INTEGER,
        amount VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        date VARCHAR(50) NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
      )
    `);

    isInitialized = true;
    console.log('✅ PostgreSQL Database connected and schema initialized.');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error);
  }
};

// Auto-initialize when DATABASE_URL is available
if (process.env.DATABASE_URL) {
  initDb();
} else {
  console.warn('⚠️ No DATABASE_URL found.');
}

export default pool;
