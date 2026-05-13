require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

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

// ==========================================
// ADMIN API ENDPOINTS (AUTHENTICATION)
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admin_panel WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// ==========================================
// PROTECTED CRUD ENDPOINTS
// ==========================================

// --- CATEGORIES ---
app.post('/api/categories', authenticateToken, async (req, res) => {
  const { name, slug, icon } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, icon]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', authenticateToken, async (req, res) => {
  const { name, slug, icon } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1, slug = $2, icon = $3 WHERE id = $4 RETURNING *',
      [name, slug, icon, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const products = await pool.query('SELECT id FROM products WHERE category_id = $1 LIMIT 1', [req.params.id]);
    if (products.rows.length > 0) {
      return res.status(400).json({ error: 'Tidak bisa menghapus kategori ini karena masih digunakan oleh beberapa sapi. Hapus atau ganti kategori sapi tersebut terlebih dahulu.' });
    }
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- FARMS ---
app.post('/api/farms', authenticateToken, async (req, res) => {
  const { name, location, image_url, description, badge, stats_sapi, stats_luas, stats_tahun, accent_color } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO farms (name, location, image_url, description, badge, stats_sapi, stats_luas, stats_tahun, accent_color) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, location, image_url, description, badge, stats_sapi, stats_luas, stats_tahun, accent_color]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/farms/:id', authenticateToken, async (req, res) => {
  const { name, location, image_url, description, badge, stats_sapi, stats_luas, stats_tahun, accent_color } = req.body;
  try {
    const result = await pool.query(
      `UPDATE farms SET name = $1, location = $2, image_url = $3, description = $4, badge = $5, 
       stats_sapi = $6, stats_luas = $7, stats_tahun = $8, accent_color = $9 WHERE id = $10 RETURNING *`,
      [name, location, image_url, description, badge, stats_sapi, stats_luas, stats_tahun, accent_color, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/farms/:id', authenticateToken, async (req, res) => {
  try {
    const products = await pool.query('SELECT id FROM products WHERE farm_id = $1 LIMIT 1', [req.params.id]);
    if (products.rows.length > 0) {
      return res.status(400).json({ error: 'Tidak bisa menghapus kandang ini karena masih memiliki sapi yang terdaftar. Hapus atau pindahkan sapi tersebut terlebih dahulu.' });
    }
    await pool.query('DELETE FROM farms WHERE id = $1', [req.params.id]);
    res.json({ message: 'Farm deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PRODUCTS ---
app.post('/api/products', authenticateToken, async (req, res) => {
  const { kode_unik, name, jenis, bobot, posisi, harga, image_url, gallery, category_id, farm_id, is_active } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (kode_unik, name, jenis, bobot, posisi, harga, image_url, gallery, category_id, farm_id, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [kode_unik, name, jenis, bobot, posisi, harga, image_url, gallery ? JSON.stringify(gallery) : '[]', category_id || null, farm_id || null, is_active ?? true]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  const { kode_unik, name, jenis, bobot, posisi, harga, image_url, gallery, category_id, farm_id, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET kode_unik = $1, name = $2, jenis = $3, bobot = $4, posisi = $5, harga = $6, 
       image_url = $7, gallery = $8, category_id = $9, farm_id = $10, is_active = $11 WHERE id = $12 RETURNING *`,
      [kode_unik, name, jenis, bobot, posisi, harga, image_url, gallery ? JSON.stringify(gallery) : '[]', category_id || null, farm_id || null, is_active ?? true, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Export for Vercel
module.exports = app;

// Listen if running locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}