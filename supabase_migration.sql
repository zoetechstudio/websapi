-- ==========================================
-- SUPABASE INITIALIZATION & MIGRATION SCRIPT
-- ==========================================
-- Run ini di SQL Editor Supabase yang baru
-- ==========================================

-- 1. DROP EXISTING TABLES JIKA ADA
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

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read farms" ON farms FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);

-- 6. INSERT SEED DATA FOR CATEGORIES
INSERT INTO categories (name, slug, icon) VALUES
  ('Ekonomis',      'ekonomis',      '🐄'),
  ('Medium',        'medium',        '🐄'),
  ('Premium',       'premium',       '🐄'),
  ('Kambing Domba', 'kambing-domba', '🐐'),
  ('Sapi Bali',     'sapi-bali',     '🐂');

-- 7. INSERT SEED DATA FOR FARMS (Premium Data)
INSERT INTO farms (name, location, image_url, description, badge, stats_sapi, stats_luas, stats_tahun, accent_color) VALUES
  (
    'Purnama Farm', 
    'Bogor, Jawa Barat', 
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
    'Mitra utama IndoPalm Sapi. Pusat peternakan sapi qurban berkualitas, dirawat dengan prosedur standar tinggi dan pengawasan ketat.',
    'MITRA UTAMA IPS',
    '120+', '4 Ha', '2018',
    '#8c6239'
  ),
  (
    'Nusantara Livestock', 
    'Malang, Jawa Timur', 
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800',
    'Peternakan modern berbasis teknologi dengan sistem pakan terstandarisasi. Sapi dipelihara secara alami di lahan hijau subur.',
    'MITRA RESMI IPS',
    '85+', '3 Ha', '2020',
    '#64748b'
  ),
  (
    'Berkah Tani Farm', 
    'Banyuwangi, Jawa Timur', 
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
    'Peternakan berbasis komunitas lokal dengan sertifikasi halal. Menjamin kesehatan hewan dan standar syariat yang terjaga.',
    'MITRA RESMI IPS',
    '60+', '2.5 Ha', '2021',
    '#7a5232'
  );

-- 8. INSERT SEED DATA FOR PRODUCTS
-- Note: Semua farm_id diarahkan ke 1 (Purnama Farm) sesuai dengan sync terakhir
INSERT INTO products (kode_unik, name, jenis, bobot, harga, image_url, gallery, category_id, farm_id) VALUES
  ('DQ057', 'Domba DQ057 2026 Bobot 41Kg', 'Domba', 41, 4100000, 'https://images.unsplash.com/photo-1511117833450-798782046d47?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1511117833450-798782046d47?auto=format&fit=crop&w=800&q=80"]'::jsonb, 4, 1),
  ('NQ008', 'Sapi Brangus NQ008 2026 Bobot 950Kg', 'Sapi Brangus', 950, 0, 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80"]'::jsonb, 1, 1),
  ('NQ084', 'Sapi Pegon Cross Brangus NQ084 2026 Bobot 1000Kg', 'Sapi Pegon', 1000, 0, 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=800&q=80"]'::jsonb, 2, 1),
  ('NQ011', 'Sapi Simental NQ011 2026 Bobot 950Kg', 'Sapi Simental', 950, 0, 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80"]'::jsonb, 3, 1);
