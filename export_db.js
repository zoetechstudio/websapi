const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: './backend/.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.akfmdyarpcbcocjcuzlr:Irza520408301@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    let sql = `
-- ==========================================
-- SUPABASE MIGRATION SCRIPT
-- ==========================================

-- 1. DROP EXISTING TABLES
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS farms CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. CREATE CATEGORIES TABLE
CREATE TABLE categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text
);

-- 3. CREATE FARMS TABLE
CREATE TABLE farms (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  location text,
  logo_url text,
  image_url text,
  description text,
  badge text,
  stats_sapi text,
  stats_luas text,
  stats_tahun text,
  accent_color text
);

-- 4. CREATE PRODUCTS TABLE
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kode_unik text,
  name text NOT NULL,
  jenis text,
  bobot int,
  posisi text,
  harga bigint DEFAULT 0,
  image_url text,
  gallery jsonb DEFAULT '[]'::jsonb,
  category_id bigint REFERENCES categories(id),
  farm_id bigint REFERENCES farms(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read farms" ON farms FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);

-- 6. INSERT DATA
`;

    // Dump categories
    const categories = await client.query('SELECT * FROM categories ORDER BY id');
    if (categories.rows.length > 0) {
      sql += `-- Categories Data\n`;
      categories.rows.forEach(r => {
        const name = r.name.replace(/'/g, "''");
        const slug = r.slug.replace(/'/g, "''");
        const icon = r.icon ? `'${r.icon.replace(/'/g, "''")}'` : 'NULL';
        sql += `INSERT INTO categories (name, slug, icon) VALUES ('${name}', '${slug}', ${icon});\n`;
      });
      sql += '\n';
    }

    // Dump farms
    const farms = await client.query('SELECT * FROM farms ORDER BY id');
    if (farms.rows.length > 0) {
      sql += `-- Farms Data\n`;
      farms.rows.forEach(r => {
        const name = r.name.replace(/'/g, "''");
        const location = r.location ? `'${r.location.replace(/'/g, "''")}'` : 'NULL';
        const logo_url = r.logo_url ? `'${r.logo_url.replace(/'/g, "''")}'` : 'NULL';
        const image_url = r.image_url ? `'${r.image_url.replace(/'/g, "''")}'` : 'NULL';
        const description = r.description ? `'${r.description.replace(/'/g, "''")}'` : 'NULL';
        const badge = r.badge ? `'${r.badge.replace(/'/g, "''")}'` : 'NULL';
        const stats_sapi = r.stats_sapi ? `'${r.stats_sapi.replace(/'/g, "''")}'` : 'NULL';
        const stats_luas = r.stats_luas ? `'${r.stats_luas.replace(/'/g, "''")}'` : 'NULL';
        const stats_tahun = r.stats_tahun ? `'${r.stats_tahun.replace(/'/g, "''")}'` : 'NULL';
        const accent_color = r.accent_color ? `'${r.accent_color.replace(/'/g, "''")}'` : 'NULL';
        
        sql += `INSERT INTO farms (name, location, logo_url, image_url, description, badge, stats_sapi, stats_luas, stats_tahun, accent_color) VALUES ('${name}', ${location}, ${logo_url}, ${image_url}, ${description}, ${badge}, ${stats_sapi}, ${stats_luas}, ${stats_tahun}, ${accent_color});\n`;
      });
      sql += '\n';
    }

    // Dump products
    const products = await client.query('SELECT * FROM products ORDER BY id');
    if (products.rows.length > 0) {
      sql += `-- Products Data\n`;
      products.rows.forEach(r => {
        const kode_unik = r.kode_unik ? `'${r.kode_unik.replace(/'/g, "''")}'` : 'NULL';
        const name = r.name.replace(/'/g, "''");
        const jenis = r.jenis ? `'${r.jenis.replace(/'/g, "''")}'` : 'NULL';
        const bobot = r.bobot !== null ? r.bobot : 'NULL';
        const posisi = r.posisi ? `'${r.posisi.replace(/'/g, "''")}'` : 'NULL';
        const harga = r.harga !== null ? r.harga : 0;
        const image_url = r.image_url ? `'${r.image_url.replace(/'/g, "''")}'` : 'NULL';
        const gallery = r.gallery ? `'${JSON.stringify(r.gallery)}'::jsonb` : `'[]'::jsonb`;
        const category_id = r.category_id !== null ? r.category_id : 'NULL';
        const farm_id = r.farm_id !== null ? r.farm_id : 'NULL';
        const is_active = r.is_active;
        const created_at = r.created_at ? `'${r.created_at.toISOString()}'` : 'now()';
        
        sql += `INSERT INTO products (kode_unik, name, jenis, bobot, posisi, harga, image_url, gallery, category_id, farm_id, is_active, created_at) VALUES (${kode_unik}, '${name}', ${jenis}, ${bobot}, ${posisi}, ${harga}, ${image_url}, ${gallery}, ${category_id}, ${farm_id}, ${is_active}, ${created_at});\n`;
      });
      sql += '\n';
    }

    fs.writeFileSync('supabase_database_migration.sql', sql);
    console.log('✅ Generated supabase_database_migration.sql successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
