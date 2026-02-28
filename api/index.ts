import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// ─── DATABASE ───────────────────────────────────────────────
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined
});

let isInitialized = false;
const initDb = async () => {
    if (isInitialized) return;
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, role VARCHAR(50) DEFAULT 'admin', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await pool.query(`CREATE TABLE IF NOT EXISTS customers (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, phone VARCHAR(50), location VARCHAR(255), status VARCHAR(50) DEFAULT 'Active', avatar TEXT)`);
        await pool.query(`CREATE TABLE IF NOT EXISTS products (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL, sku VARCHAR(255) UNIQUE NOT NULL, stock INTEGER DEFAULT 0, price VARCHAR(50) NOT NULL, status VARCHAR(50) DEFAULT 'In Stock')`);
        await pool.query(`CREATE TABLE IF NOT EXISTS orders (id VARCHAR(255) PRIMARY KEY, customer_id INTEGER, amount VARCHAR(50) NOT NULL, status VARCHAR(50) DEFAULT 'Pending', date VARCHAR(50) NOT NULL, FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE)`);
        isInitialized = true;
    } catch (error) {
        console.error('DB init error:', error);
    }
};

if (process.env.DATABASE_URL) initDb();

// ─── EXPRESS APP ────────────────────────────────────────────
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';

app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        req.user = user;
        next();
    });
};

// Health
app.get('/api/health', (_req, res) => {
    res.json({ status: 'success', message: 'Aether Backend API is live!', timestamp: new Date().toISOString() });
});

// Register
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name are required.' });
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await pool.query('INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id', [email, hashedPassword, name]);
        res.status(201).json({ message: 'User registered successfully', id: result.rows[0].id });
    } catch (error: any) {
        if (error.code === '23505') return res.status(409).json({ error: 'Email already exists.' });
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Invalid email or password.' });
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Customers
app.get('/api/customers', authenticateToken, async (_req, res) => {
    try { res.json((await pool.query('SELECT * FROM customers')).rows); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});
app.post('/api/customers', authenticateToken, async (req, res) => {
    const { name, email, phone, location, status, avatar } = req.body;
    try {
        const result = await pool.query('INSERT INTO customers (name, email, phone, location, status, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [name, email, phone, location, status, avatar]);
        res.status(201).json({ message: 'Customer created', id: result.rows[0].id });
    } catch (error: any) { res.status(400).json({ error: error.message }); }
});
app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
        result.rowCount && result.rowCount > 0 ? res.json({ message: 'Customer deleted' }) : res.status(404).json({ error: 'Not found' });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// Products
app.get('/api/products', authenticateToken, async (_req, res) => {
    try { res.json((await pool.query('SELECT * FROM products')).rows); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});
app.post('/api/products', authenticateToken, async (req, res) => {
    const { id, name, sku, stock, price, status } = req.body;
    try {
        await pool.query('INSERT INTO products (id, name, sku, stock, price, status) VALUES ($1, $2, $3, $4, $5, $6)', [id, name, sku, stock, price, status]);
        res.status(201).json({ message: 'Product created' });
    } catch (error: any) { res.status(400).json({ error: error.message }); }
});
app.put('/api/products/:id', authenticateToken, async (req, res) => {
    const { name, sku, stock, price, status } = req.body;
    try {
        const result = await pool.query('UPDATE products SET name=$1, sku=$2, stock=$3, price=$4, status=$5 WHERE id=$6', [name, sku, stock, price, status, req.params.id]);
        result.rowCount && result.rowCount > 0 ? res.json({ message: 'Product updated' }) : res.status(404).json({ error: 'Not found' });
    } catch (error: any) { res.status(400).json({ error: error.message }); }
});
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        result.rowCount && result.rowCount > 0 ? res.json({ message: 'Product deleted' }) : res.status(404).json({ error: 'Not found' });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// Orders (Paginated)
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        const countResult = await pool.query('SELECT COUNT(*) FROM orders');
        const totalItems = parseInt(countResult.rows[0].count);
        const result = await pool.query(`SELECT orders.id, orders.amount, orders.status, orders.date, customers.name as customer, customers.email as email FROM orders JOIN customers ON orders.customer_id = customers.id ORDER BY orders.date DESC LIMIT $1 OFFSET $2`, [limit, offset]);
        res.json({ data: result.rows, meta: { totalItems, currentPage: page, totalPages: Math.ceil(totalItems / limit), limit } });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});
app.post('/api/orders', authenticateToken, async (req, res) => {
    const { id, customer, email, amount, status, date } = req.body;
    try {
        let custResult = await pool.query('SELECT id FROM customers WHERE email = $1', [email]);
        let customer_id;
        if (custResult.rows.length === 0) {
            const insertCust = await pool.query('INSERT INTO customers (name, email, status) VALUES ($1, $2, $3) RETURNING id', [customer, email, 'Active']);
            customer_id = insertCust.rows[0].id;
        } else { customer_id = custResult.rows[0].id; }
        await pool.query('INSERT INTO orders (id, customer_id, amount, status, date) VALUES ($1, $2, $3, $4, $5)', [id, customer_id, amount, status, date]);
        res.status(201).json({ message: 'Order created' });
    } catch (error: any) { res.status(400).json({ error: error.message }); }
});
app.put('/api/orders/:id', authenticateToken, async (req, res) => {
    const { amount, status, date } = req.body;
    try {
        const result = await pool.query('UPDATE orders SET amount=$1, status=$2, date=$3 WHERE id=$4', [amount, status, date, req.params.id]);
        result.rowCount && result.rowCount > 0 ? res.json({ message: 'Order updated' }) : res.status(404).json({ error: 'Not found' });
    } catch (error: any) { res.status(400).json({ error: error.message }); }
});
app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
        result.rowCount && result.rowCount > 0 ? res.json({ message: 'Order deleted' }) : res.status(404).json({ error: 'Not found' });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ─── EXPORT ─────────────────────────────────────────────────
export default app;
