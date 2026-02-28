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
        await pool.query(`CREATE TABLE IF NOT EXISTS products (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL, sku VARCHAR(255) UNIQUE NOT NULL, stock INTEGER DEFAULT 0, price VARCHAR(50) NOT NULL, status VARCHAR(50) DEFAULT 'In Stock', image_url TEXT)`);
        await pool.query(`CREATE TABLE IF NOT EXISTS orders (id VARCHAR(255) PRIMARY KEY, customer_id INTEGER, amount VARCHAR(50) NOT NULL, status VARCHAR(50) DEFAULT 'Pending', date VARCHAR(50) NOT NULL, FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE)`);
        await pool.query(`CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, user_id INTEGER, message TEXT NOT NULL, type VARCHAR(50) DEFAULT 'info', read BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)`);
        // Add image_url column if it doesn't exist (for existing deployments)
        await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT`);
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

// ─── AUTH MIDDLEWARE ─────────────────────────────────────────
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

// ─── VALIDATION HELPERS ─────────────────────────────────────
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePrice = (price: string) => /^\$?\d+(\.\d{1,2})?$/.test(price.replace(/[,$]/g, ''));
const validateRequired = (fields: Record<string, any>, required: string[]) => {
    const missing = required.filter(f => !fields[f] || (typeof fields[f] === 'string' && fields[f].trim() === ''));
    if (missing.length > 0) return `Missing required fields: ${missing.join(', ')}`;
    return null;
};

// ─── HEALTH ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'success', message: 'Aether Backend API is live!', timestamp: new Date().toISOString() });
});

// ─── AUTH ────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;
    const validationErr = validateRequired(req.body, ['email', 'password', 'name']);
    if (validationErr) return res.status(400).json({ error: validationErr });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
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

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
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

// ─── PROFILE UPDATE ─────────────────────────────────────────
app.put('/api/users/profile', authenticateToken, async (req: any, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format.' });
    try {
        await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name.trim(), email.trim(), req.user.id]);
        const token = jwt.sign({ id: req.user.id, email: email.trim(), name: name.trim(), role: req.user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Profile updated', token, user: { id: req.user.id, name: name.trim(), email: email.trim(), role: req.user.role } });
    } catch (error: any) {
        if (error.code === '23505') return res.status(409).json({ error: 'Email already in use.' });
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/password', authenticateToken, async (req: any, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new passwords are required.' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    try {
        const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });
        const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
        if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
        res.json({ message: 'Password updated successfully.' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// ─── DASHBOARD STATS (with date filtering) ──────────────────
app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
        const days = parseInt(req.query.days as string) || 30;
        const now = new Date();
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const prevCutoff = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Current period
        const currentOrders = await pool.query(`SELECT * FROM orders WHERE date >= $1`, [cutoff]);
        const currentRevenue = currentOrders.rows.reduce((sum: number, o: any) => sum + parseFloat((o.amount || '0').replace(/[^0-9.-]/g, '')), 0);
        const activeOrders = currentOrders.rows.filter((o: any) => o.status === 'Processing' || o.status === 'Pending').length;
        const completedOrders = currentOrders.rows.filter((o: any) => o.status === 'Completed').length;

        // Previous period for trend comparison
        const prevOrders = await pool.query(`SELECT * FROM orders WHERE date >= $1 AND date < $2`, [prevCutoff, cutoff]);
        const prevRevenue = prevOrders.rows.reduce((sum: number, o: any) => sum + parseFloat((o.amount || '0').replace(/[^0-9.-]/g, '')), 0);

        // Totals
        const totalCustomers = (await pool.query('SELECT COUNT(*) FROM customers')).rows[0].count;
        const activeCustomers = (await pool.query(`SELECT COUNT(*) FROM customers WHERE status = 'Active'`)).rows[0].count;
        const totalProducts = (await pool.query('SELECT COUNT(*) FROM products')).rows[0].count;
        const inStockProducts = (await pool.query(`SELECT COUNT(*) FROM products WHERE status = 'In Stock'`)).rows[0].count;

        // Revenue trend %
        const revenueTrend = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue * 100) : (currentRevenue > 0 ? 100 : 0);

        res.json({
            revenue: { current: currentRevenue, previous: prevRevenue, trend: Math.round(revenueTrend * 10) / 10 },
            orders: { total: currentOrders.rows.length, active: activeOrders, completed: completedOrders, previousTotal: prevOrders.rows.length },
            customers: { total: parseInt(totalCustomers), active: parseInt(activeCustomers) },
            products: { total: parseInt(totalProducts), inStock: parseInt(inStockProducts) },
            period: { days, from: cutoff, to: now.toISOString().split('T')[0] }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// ─── NOTIFICATIONS ──────────────────────────────────────────
app.get('/api/notifications', authenticateToken, async (req: any, res) => {
    try {
        const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [req.user.id]);
        const unread = await pool.query('SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false', [req.user.id]);
        res.json({ notifications: result.rows, unreadCount: parseInt(unread.rows[0].count) });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req: any, res) => {
    try {
        await pool.query('UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ message: 'Notification marked as read.' });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

app.put('/api/notifications/read-all', authenticateToken, async (req: any, res) => {
    try {
        await pool.query('UPDATE notifications SET read = true WHERE user_id = $1', [req.user.id]);
        res.json({ message: 'All notifications marked as read.' });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// Helper to create a notification
const createNotification = async (userId: number, message: string, type: string = 'info') => {
    try {
        await pool.query('INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)', [userId, message, type]);
    } catch (e) { /* silent fail */ }
};

// ─── CUSTOMERS ──────────────────────────────────────────────
app.get('/api/customers', authenticateToken, async (_req, res) => {
    try { res.json((await pool.query('SELECT * FROM customers ORDER BY id DESC')).rows); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

app.post('/api/customers', authenticateToken, async (req: any, res) => {
    const { name, email, phone, location, status, avatar } = req.body;
    const err = validateRequired(req.body, ['name', 'email']);
    if (err) return res.status(400).json({ error: err });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format.' });
    try {
        const result = await pool.query('INSERT INTO customers (name, email, phone, location, status, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [name.trim(), email.trim(), phone || null, location || null, status || 'Active', avatar || null]);
        res.status(201).json({ message: 'Customer created', id: result.rows[0].id });
    } catch (error: any) {
        if (error.code === '23505') return res.status(409).json({ error: 'Customer email already exists.' });
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
        result.rowCount && result.rowCount > 0 ? res.json({ message: 'Customer deleted' }) : res.status(404).json({ error: 'Not found' });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ─── PRODUCTS ───────────────────────────────────────────────
app.get('/api/products', authenticateToken, async (_req, res) => {
    try { res.json((await pool.query('SELECT * FROM products ORDER BY name ASC')).rows); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    const { id, name, sku, stock, price, status, image_url } = req.body;
    const err = validateRequired(req.body, ['id', 'name', 'sku', 'price']);
    if (err) return res.status(400).json({ error: err });
    if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) return res.status(400).json({ error: 'Stock must be a non-negative number.' });
    try {
        await pool.query('INSERT INTO products (id, name, sku, stock, price, status, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, name.trim(), sku.trim(), stock || 0, price, status || 'In Stock', image_url || null]);
        res.status(201).json({ message: 'Product created' });
    } catch (error: any) {
        if (error.code === '23505') return res.status(409).json({ error: 'Product ID or SKU already exists.' });
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
    const { name, sku, stock, price, status, image_url } = req.body;
    const err = validateRequired(req.body, ['name', 'sku', 'price']);
    if (err) return res.status(400).json({ error: err });
    try {
        const result = await pool.query('UPDATE products SET name=$1, sku=$2, stock=$3, price=$4, status=$5, image_url=$6 WHERE id=$7', [name.trim(), sku.trim(), stock || 0, price, status, image_url || null, req.params.id]);
        result.rowCount && result.rowCount > 0 ? res.json({ message: 'Product updated' }) : res.status(404).json({ error: 'Not found' });
    } catch (error: any) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        result.rowCount && result.rowCount > 0 ? res.json({ message: 'Product deleted' }) : res.status(404).json({ error: 'Not found' });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ─── ORDERS (Paginated + Status Workflow) ───────────────────
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

app.post('/api/orders', authenticateToken, async (req: any, res) => {
    const { id, customer, email, amount, status, date } = req.body;
    const err = validateRequired(req.body, ['id', 'customer', 'email', 'amount', 'date']);
    if (err) return res.status(400).json({ error: err });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid customer email.' });
    try {
        let custResult = await pool.query('SELECT id FROM customers WHERE email = $1', [email]);
        let customer_id;
        if (custResult.rows.length === 0) {
            const insertCust = await pool.query('INSERT INTO customers (name, email, status) VALUES ($1, $2, $3) RETURNING id', [customer, email, 'Active']);
            customer_id = insertCust.rows[0].id;
        } else { customer_id = custResult.rows[0].id; }
        await pool.query('INSERT INTO orders (id, customer_id, amount, status, date) VALUES ($1, $2, $3, $4, $5)', [id, customer_id, amount, status || 'Pending', date]);
        await createNotification(req.user.id, `New order ${id} created for $${amount}`, 'order');
        res.status(201).json({ message: 'Order created' });
    } catch (error: any) { res.status(400).json({ error: error.message }); }
});

app.put('/api/orders/:id', authenticateToken, async (req: any, res) => {
    const { amount, status, date } = req.body;
    try {
        // Get old status for notification
        const old = await pool.query('SELECT status FROM orders WHERE id = $1', [req.params.id]);
        const result = await pool.query('UPDATE orders SET amount=$1, status=$2, date=$3 WHERE id=$4', [amount, status, date, req.params.id]);
        if (result.rowCount && result.rowCount > 0) {
            if (old.rows.length > 0 && old.rows[0].status !== status) {
                await createNotification(req.user.id, `Order ${req.params.id} status changed: ${old.rows[0].status} → ${status}`, 'order');
            }
            res.json({ message: 'Order updated' });
        } else { res.status(404).json({ error: 'Not found' }); }
    } catch (error: any) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
        result.rowCount && result.rowCount > 0 ? res.json({ message: 'Order deleted' }) : res.status(404).json({ error: 'Not found' });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ─── SEARCH ─────────────────────────────────────────────────
app.get('/api/search', authenticateToken, async (req, res) => {
    const q = (req.query.q as string || '').trim();
    if (!q || q.length < 2) return res.json({ orders: [], products: [], customers: [] });
    const pattern = `%${q}%`;
    try {
        const orders = await pool.query(`SELECT orders.id, orders.amount, orders.status, orders.date, customers.name as customer FROM orders JOIN customers ON orders.customer_id = customers.id WHERE orders.id ILIKE $1 OR customers.name ILIKE $1 OR customers.email ILIKE $1 LIMIT 5`, [pattern]);
        const products = await pool.query(`SELECT id, name, sku, price, status FROM products WHERE name ILIKE $1 OR sku ILIKE $1 LIMIT 5`, [pattern]);
        const customers = await pool.query(`SELECT id, name, email, status FROM customers WHERE name ILIKE $1 OR email ILIKE $1 LIMIT 5`, [pattern]);
        res.json({ orders: orders.rows, products: products.rows, customers: customers.rows });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

// ─── EXPORT ─────────────────────────────────────────────────
export default app;
