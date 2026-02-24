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

// --- PHASE 2: ADDING, UPDATING, AND DELETING PRODUCTS ---

// 2a. Create a New Product (POST)
app.post('/api/products', (req, res) => {
    // req.body contains the JSON data sent from the React frontend
    const { id, name, sku, stock, price, status } = req.body;

    try {
        const stmt = db.prepare('INSERT INTO products (id, name, sku, stock, price, status) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(id, name, sku, stock, price, status);
        // We tell the frontend we successfully created it
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error: any) {
        // If the SKU already exists, SQLite will throw an error. We want to catch that.
        res.status(400).json({ error: error.message });
    }
});

// 2b. Update an Existing Product (PUT)
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id; // We grab the product ID from the URL!
    const { name, sku, stock, price, status } = req.body;

    try {
        const stmt = db.prepare('UPDATE products SET name = ?, sku = ?, stock = ?, price = ?, status = ? WHERE id = ?');
        const info = stmt.run(name, sku, stock, price, status, productId);

        // info.changes tells us how many rows were updated. If it's 0, the product ID didn't exist!
        if (info.changes > 0) {
            res.json({ message: 'Product updated successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 2c. Delete a Product (DELETE)
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    try {
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        const info = stmt.run(productId);

        if (info.changes > 0) {
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
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

// 3a. Create a New Order (POST)
app.post('/api/orders', (req, res) => {
    const { id, customer, email, amount, status, date } = req.body;
    try {
        // Find existing customer by email, or create a quick stub if not found
        let cust = db.prepare('SELECT id FROM customers WHERE email = ?').get(email) as any;
        let customer_id;

        if (!cust) {
            const info = db.prepare('INSERT INTO customers (name, email, status) VALUES (?, ?, ?)')
                .run(customer, email, 'Active');
            customer_id = info.lastInsertRowid;
        } else {
            customer_id = cust.id;
        }

        const stmt = db.prepare('INSERT INTO orders (id, customer_id, amount, status, date) VALUES (?, ?, ?, ?, ?)');
        stmt.run(id, customer_id, amount, status, date);

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 3b. Update an Order (PUT)
app.put('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const { amount, status, date } = req.body;
    try {
        const stmt = db.prepare('UPDATE orders SET amount = ?, status = ?, date = ? WHERE id = ?');
        const info = stmt.run(amount, status, date, orderId);
        if (info.changes > 0) {
            res.json({ message: 'Order updated successfully' });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 3c. Delete an Order (DELETE)
app.delete('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    try {
        const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
        const info = stmt.run(orderId);
        if (info.changes > 0) {
            res.json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 4a. Create a New Customer (POST)
app.post('/api/customers', (req, res) => {
    const { name, email, phone, location, status, avatar } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO customers (name, email, phone, location, status, avatar) VALUES (?, ?, ?, ?, ?, ?)');
        const info = stmt.run(name, email, phone, location, status, avatar);
        res.status(201).json({ message: 'Customer created successfully', id: info.lastInsertRowid });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 4b. Delete a Customer (DELETE)
app.delete('/api/customers/:id', (req, res) => {
    const customerId = req.params.id;
    try {
        const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
        const info = stmt.run(customerId);
        if (info.changes > 0) {
            res.json({ message: 'Customer deleted successfully' });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server listening on PORT 5000
app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 Aether Backend running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`======================================\n`);
});
