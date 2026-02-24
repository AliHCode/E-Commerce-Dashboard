import Database from 'better-sqlite3';
import path from 'path';

// 1. Connection: We tell better-sqlite3 where to store our database file.
// If 'aether.db' doesn't exist, it will create it in the server folder automatically!
const dbPath = path.resolve(__dirname, 'aether.db');
const db = new Database(dbPath, { verbose: console.log }); // verbose lets us see the SQL queries in the terminal

console.log('✅ Connected to the SQLite database.');

// 2. Pragmas: These are SQLite settings.
// WAL (Write-Ahead Logging) makes the database much faster and supports better concurrency.
db.pragma('journal_mode = WAL');
// Enforce Foreign Key constraints (ensuring an Order belongs to a real Customer)
db.pragma('foreign_keys = ON');

// 3. The Schema (The Blueprint):
// We execute a block of SQL to create our tables if they don't already exist.
// This is like setting up the empty columns in an Excel spreadsheet.
const initDb = () => {
    db.exec(`
    -- Customers Table
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      location TEXT,
      status TEXT DEFAULT 'Active',
      avatar TEXT
    );

    -- Products Table
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      stock INTEGER DEFAULT 0,
      price TEXT NOT NULL,
      status TEXT DEFAULT 'In Stock'
    );

    -- Orders Table
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_id INTEGER,
      amount TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      date TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
    );
  `);
    console.log('✅ Database schema initialized successfully.');
};

// Immediately initialize the tables when this file is imported
initDb();

// Export the 'db' reference so our Express routes in other files can use it to query data!
export default db;
