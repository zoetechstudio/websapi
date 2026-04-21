require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const cowKits = [
  [
    'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1558024920-b41e1887dc32?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'
  ],
  [
    'https://images.unsplash.com/photo-1527153358354-fbc1b5f9ab21?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1545468843-2796674f3df5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563510332301-496350f4a86b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=800'
  ]
];

async function populate() {
  try {
    const products = await pool.query('SELECT id FROM products');
    for (let i = 0; i < products.rows.length; i++) {
        const productId = products.rows[i].id;
        const gallery = cowKits[i % cowKits.length];
        await pool.query('UPDATE products SET gallery = $1 WHERE id = $2', [JSON.stringify(gallery), productId]);
        console.log(`Populated gallery for product ${productId}`);
    }
    console.log('Success!');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

populate();
