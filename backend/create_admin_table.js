const { Client } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    
    console.log('Creating admin_panel table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_panel (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Check if admin already exists
    const res = await client.query('SELECT * FROM admin_panel WHERE username = $1', ['admin']);
    if (res.rows.length === 0) {
      console.log('Inserting default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query('INSERT INTO admin_panel (username, password) VALUES ($1, $2)', ['admin', hashedPassword]);
      console.log('Default admin user inserted (Username: admin, Password: admin123)');
    } else {
      console.log('Admin user already exists.');
    }
    
    console.log('✅ Admin table setup complete.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
