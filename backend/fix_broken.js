require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixProduct() {
  try {
    const newUrl = 'https://images.unsplash.com/photo-1558024920-b41e1887dc32?auto=format&fit=crop&q=80&w=800';
    await pool.query("UPDATE products SET image_url = $1 WHERE kode_unik = 'NQ008'", [newUrl]);
    console.log('Fixed NQ008 image URL!');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

fixProduct();
