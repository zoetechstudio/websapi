require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateFarms() {
  try {
    console.log('Updating farm names to Indopalm...');
    const result = await pool.query(`
      UPDATE farms 
      SET name = REPLACE(name, 'Nusa Farm', 'Indopalm Farm') 
      WHERE name LIKE 'Nusa Farm%'
    `);
    console.log(`Success! Updated ${result.rowCount} farms.`);
  } catch (err) {
    console.error('Error updating farms:', err);
  } finally {
    await pool.end();
  }
}

updateFarms();
