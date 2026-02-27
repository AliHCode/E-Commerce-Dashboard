import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// PostgreSQL Connection Pool
// This is much better than SQLite for production because it connects over the network
// to a permanent cloud database that Vercel won't delete.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Required for Neon/Supabase cloud connections
  ssl: {
    rejectUnauthorized: false
  }
});

export const initDb = async () => {
  try {
    await pool.query(`
            -- Users Table (For Authentication)
            CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              email VARCHAR(255) UNIQUE NOT NULL,
              password_hash VARCHAR(255) NOT NULL,
              name VARCHAR(255) NOT NULL,
              role VARCHAR(50) DEFAULT 'admin',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Customers Table
            CREATE TABLE IF NOT EXISTS customers (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) UNIQUE NOT NULL,
              phone VARCHAR(50),
              location VARCHAR(255),
              status VARCHAR(50) DEFAULT 'Active',
              avatar TEXT
            );

            -- Products Table
            CREATE TABLE IF NOT EXISTS products (
              id VARCHAR(255) PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              sku VARCHAR(255) UNIQUE NOT NULL,
              stock INTEGER DEFAULT 0,
              price VARCHAR(50) NOT NULL,
              status VARCHAR(50) DEFAULT 'In Stock'
            );

            -- Orders Table
            CREATE TABLE IF NOT EXISTS orders (
              id VARCHAR(255) PRIMARY KEY,
              customer_id INTEGER,
              amount VARCHAR(50) NOT NULL,
              status VARCHAR(50) DEFAULT 'Pending',
              date VARCHAR(50) NOT NULL,
              FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
            );
        `);
    console.log('✅ PostgreSQL Database connected and schema initialized.');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL. Have you set DATABASE_URL in .env?', error);
  }
};

// Initialize tables if a DATABASE_URL is actually provided
if (process.env.DATABASE_URL) {
  // We still run it casually for the main app
  initDb();
} else {
  console.warn('⚠️ No DATABASE_URL found. Please paste your Neon connection string into the .env file.');
}

export default pool;
