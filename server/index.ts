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
app.get('/api/customers', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM customers');
        res.json(result.rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get all Products
app.get('/api/products', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- PHASE 2: ADDING, UPDATING, AND DELETING PRODUCTS ---

// 2a. Create a New Product (POST)
app.post('/api/products', async (req, res) => {
    const { id, name, sku, stock, price, status } = req.body;
    try {
        await db.query(
            'INSERT INTO products (id, name, sku, stock, price, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, name, sku, stock, price, status]
        );
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 2b. Update an Existing Product (PUT)
app.put('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, sku, stock, price, status } = req.body;
    try {
        const result = await db.query(
            'UPDATE products SET name = $1, sku = $2, stock = $3, price = $4, status = $5 WHERE id = $6',
            [name, sku, stock, price, status, productId]
        );
        if (result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Product updated successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 2c. Delete a Product (DELETE)
app.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1', [productId]);
        if (result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Get all Orders (with the customer's name attached!)
app.get('/api/orders', async (req, res) => {
    try {
        const result = await db.query(`
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
        `);
        res.json(result.rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3a. Create a New Order (POST)
app.post('/api/orders', async (req, res) => {
    const { id, customer, email, amount, status, date } = req.body;
    try {
        let custResult = await db.query('SELECT id FROM customers WHERE email = $1', [email]);
        let customer_id;

        if (custResult.rows.length === 0) {
            const insertCust = await db.query(
                'INSERT INTO customers (name, email, status) VALUES ($1, $2, $3) RETURNING id',
                [customer, email, 'Active']
            );
            customer_id = insertCust.rows[0].id;
        } else {
            customer_id = custResult.rows[0].id;
        }

        await db.query(
            'INSERT INTO orders (id, customer_id, amount, status, date) VALUES ($1, $2, $3, $4, $5)',
            [id, customer_id, amount, status, date]
        );

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 3b. Update an Order (PUT)
app.put('/api/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    const { amount, status, date } = req.body;
    try {
        const result = await db.query(
            'UPDATE orders SET amount = $1, status = $2, date = $3 WHERE id = $4',
            [amount, status, date, orderId]
        );
        if (result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Order updated successfully' });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 3c. Delete an Order (DELETE)
app.delete('/api/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        const result = await db.query('DELETE FROM orders WHERE id = $1', [orderId]);
        if (result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 4a. Create a New Customer (POST)
app.post('/api/customers', async (req, res) => {
    const { name, email, phone, location, status, avatar } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO customers (name, email, phone, location, status, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [name, email, phone, location, status, avatar]
        );
        res.status(201).json({ message: 'Customer created successfully', id: result.rows[0].id });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 4b. Delete a Customer (DELETE)
app.delete('/api/customers/:id', async (req, res) => {
    const customerId = req.params.id;
    try {
        const result = await db.query('DELETE FROM customers WHERE id = $1', [customerId]);
        if (result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Customer deleted successfully' });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Only listen on the port if we are running the server locally (not in a Vercel serverless environment)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n======================================`);
        console.log(`🚀 Aether Backend running on port ${PORT}`);
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`======================================\n`);
    });
}

// Export the app for Vercel's serverless builder in api/index.ts
export default app;
