require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL Pool Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors());
app.use(express.json());

// 1. Get Categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Get Products
app.get('/api/products', async (req, res) => {
  const { category, farm, search } = req.query;
  
  try {
    let query = `
      SELECT p.*, c.name as category_name, f.name as farm_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN farms f ON p.farm_id = f.id
      WHERE p.is_active = true
    `;
    const params = [];
    
    if (category && category !== 'Semua Kategori') {
      params.push(category);
      query += ` AND c.name = $${params.length}`;
    }
    if (farm && farm !== 'Semua Kandang') {
      params.push(farm);
      query += ` AND f.name = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.name ILIKE $${params.length} OR p.kode_unik ILIKE $${params.length})`;
    }
    
    query += ' ORDER BY p.id DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. Get Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, f.name as farm_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN farms f ON p.farm_id = f.id
      WHERE p.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. Get Farms
app.get('/api/farms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM farms ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching farms:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Indopalm Sapi API is running (Connected to Database)...');
});

// Export for Vercel
module.exports = app;

// Listen if running locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}