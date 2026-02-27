import db from './db';

console.log('🌱 Starting database seed...');

const seedData = async () => {
  try {
    // --- 1. CLEARING OLD DATA ---
    console.log('Sweeping old data...');
    await db.query('DELETE FROM orders');
    await db.query('DELETE FROM products');
    await db.query('DELETE FROM customers');

    // --- 2. SEED CUSTOMERS ---
    console.log('Injecting Customers...');

    const insertCustomer = `
            INSERT INTO customers (name, email, phone, location, status, avatar)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `;

    const alexRes = await db.query(insertCustomer, ['Alex Morgan', 'alex@aether.io', '+1 (555) 123-4567', 'New York, USA', 'Active', 'https://picsum.photos/seed/alex/100/100']);
    const sarahRes = await db.query(insertCustomer, ['Sarah Chen', 'sarah@example.com', '+1 (555) 987-6543', 'San Francisco, USA', 'Active', 'https://picsum.photos/seed/sarah/100/100']);
    const emmaRes = await db.query(insertCustomer, ['Emma Brown', 'emma@example.com', '+1 (555) 555-4444', 'Toronto, Canada', 'Pending', 'https://picsum.photos/seed/emma/100/100']);

    const alexId = alexRes.rows[0].id;
    const sarahId = sarahRes.rows[0].id;
    const emmaId = emmaRes.rows[0].id;

    // --- 3. SEED PRODUCTS ---
    console.log('Injecting Products...');
    const insertProduct = `
            INSERT INTO products (id, name, sku, stock, price, status)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

    await db.query(insertProduct, ['INV-001', 'Mechanical Keyboard', 'MK-87-RGB', 45, '$129.99', 'In Stock']);
    await db.query(insertProduct, ['INV-002', 'Wireless Mouse', 'WM-PRO-X', 12, '$79.99', 'Low Stock']);
    await db.query(insertProduct, ['INV-003', '27" 4K Monitor', 'MON-4K-IPS', 0, '$499.99', 'Out of Stock']);
    await db.query(insertProduct, ['INV-004', 'USB-C Hub', 'USB-C-7IN1', 89, '$49.99', 'In Stock']);

    // --- 4. SEED ORDERS ---
    console.log('Injecting Orders...');
    const insertOrder = `
            INSERT INTO orders (id, customer_id, amount, status, date)
            VALUES ($1, $2, $3, $4, $5)
        `;

    await db.query(insertOrder, ['ORD-001', alexId, '$250.00', 'Completed', '2023-06-23']);
    await db.query(insertOrder, ['ORD-002', sarahId, '$150.00', 'Processing', '2023-06-24']);
    await db.query(insertOrder, ['ORD-003', alexId, '$350.00', 'Completed', '2023-06-25']);
    await db.query(insertOrder, ['ORD-004', emmaId, '$450.00', 'Pending', '2023-06-26']);
    await db.query(insertOrder, ['ORD-005', sarahId, '$550.00', 'Completed', '2023-06-27']);

    console.log('🌿 Database seeded successfully with PostgreSQL!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    db.end(); // close the pool so the script exits
  }
};

seedData();
