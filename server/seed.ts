import db from './db'; // Import our configured database connection

console.log('🌱 Starting database seed...');

// --- 1. PREPARING THE SQL COMMANDS ---
// We use '?' as placeholders for data. This is crucial for security to prevent SQL Injection.
const insertCustomer = db.prepare(`
  INSERT INTO customers (name, email, phone, location, status, avatar)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertProduct = db.prepare(`
  INSERT INTO products (id, name, sku, stock, price, status)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertOrder = db.prepare(`
  INSERT INTO orders (id, customer_id, amount, status, date)
  VALUES (?, ?, ?, ?, ?)
`);


// --- 2. CLEARING OLD DATA ---
// Let's clear any existing data so we don't insert duplicates if we run this seed file twice!
db.exec('DELETE FROM orders');
db.exec('DELETE FROM products');
db.exec('DELETE FROM customers');


// --- 3. EXECUTING THE INSERTS INSIDE A TRANSACTION ---
// A transaction ensures that if one insert fails, they ALL fail. It prevents corrupted data.
const seedData = db.transaction(() => {

    // A. Seed Customers
    console.log('Injecting Customers...');
    // We save the ID returned from the database because we need it for the orders!
    const alexInfo = insertCustomer.run('Alex Morgan', 'alex@aether.io', '+1 (555) 123-4567', 'New York, USA', 'Active', 'https://picsum.photos/seed/alex/100/100');
    const sarahInfo = insertCustomer.run('Sarah Chen', 'sarah@example.com', '+1 (555) 987-6543', 'San Francisco, USA', 'Active', 'https://picsum.photos/seed/sarah/100/100');
    const emmaInfo = insertCustomer.run('Emma Brown', 'emma@example.com', '+1 (555) 555-4444', 'Toronto, Canada', 'Pending', 'https://picsum.photos/seed/emma/100/100');

    const alexId = alexInfo.lastInsertRowid;
    const sarahId = sarahInfo.lastInsertRowid;
    const emmaId = emmaInfo.lastInsertRowid;

    // B. Seed Products
    console.log('Injecting Products...');
    insertProduct.run('INV-001', 'Mechanical Keyboard', 'MK-87-RGB', 45, '$129.99', 'In Stock');
    insertProduct.run('INV-002', 'Wireless Mouse', 'WM-PRO-X', 12, '$79.99', 'Low Stock');
    insertProduct.run('INV-003', '27" 4K Monitor', 'MON-4K-IPS', 0, '$499.99', 'Out of Stock');
    insertProduct.run('INV-004', 'USB-C Hub', 'USB-C-7IN1', 89, '$49.99', 'In Stock');

    // C. Seed Orders (Using the customer IDs we saved above)
    console.log('Injecting Orders...');
    insertOrder.run('ORD-001', alexId, '$250.00', 'Completed', '2023-06-23');
    insertOrder.run('ORD-002', sarahId, '$150.00', 'Processing', '2023-06-24');
    insertOrder.run('ORD-003', alexId, '$350.00', 'Completed', '2023-06-25');
    insertOrder.run('ORD-004', emmaId, '$450.00', 'Pending', '2023-06-26');
    insertOrder.run('ORD-005', sarahId, '$550.00', 'Completed', '2023-06-27');

});

// Run the transaction function
seedData();

console.log('🌿 Database seeded successfully! You can now access standard test data.');
