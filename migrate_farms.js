const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.akfmdyarpcbcocjcuzlr:Irza520408301@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

const sql = `
-- 1. ALTER TABLE
ALTER TABLE farms ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS stats_sapi text;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS stats_luas text;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS stats_tahun text;
ALTER TABLE farms ADD COLUMN IF NOT EXISTS accent_color text;

-- 2. TRUNCATE AND RE-SEED (TO ENSURE FRESH DATA)
TRUNCATE TABLE farms CASCADE;

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
`;

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase!');
    await client.query(sql);
    console.log('✅ Farms table updated and seeded successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
