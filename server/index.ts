import express from 'express';
// We use CORS so our React frontend (running on port 3000) can talk to our Express backend (running on port 5000)
import cors from 'cors';
import db from './db'; // 👈 IMPORT OUR NEW DATABASE FILE

// Set up the Express application
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Allow the server to understand JSON data in the body of requests

// --- OUR FIRST API ROUTE ---
// When someone goes to http://localhost:5000/api/health in their browser, the server responds with this JSON message!
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to the Aether Backend API!',
        timestamp: new Date().toISOString()
    });
});

// --- STEP 4: FETCHING DATA FROM SQLITE ---

// 1. Get all Customers
app.get('/api/customers', (req, res) => {
    // 'db.prepare' gets a SQL statement ready. '.all()' fetches EVERY row that matches.
    const customers = db.prepare('SELECT * FROM customers').all();
    res.json(customers);
});

// 2. Get all Products
app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
});

// 3. Get all Orders (with the customer's name attached!)
app.get('/api/orders', (req, res) => {
    // A "JOIN" is how SQL combines tables. We match the order's customer_id to the customer's actual id.
    const orders = db.prepare(`
    SELECT 
      orders.id, 
      orders.amount, 
      orders.status, 
      orders.date,
      customers.name as customer,
      customers.email as email
    FROM orders
    JOIN customers ON orders.customer_id = customers.id
    ORDER BY orders.date DESC
  `).all();
    res.json(orders);
});

// Start the server listening on PORT 5000
app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 Aether Backend running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`======================================\n`);
});
