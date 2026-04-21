const { Client } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const columns = [
  'image_url text',
  'description text',
  'badge text',
  'stats_sapi text',
  'stats_luas text',
  'stats_tahun text',
  'accent_color text'
];

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected!');

    for (const col of columns) {
      console.log(`Adding column: ${col}...`);
      await client.query(`ALTER TABLE farms ADD COLUMN IF NOT EXISTS ${col}`);
    }

    console.log('Cleaning table...');
    await client.query("DELETE FROM farms"); // Simpler than truncate cascade if everything is linked but I want to re-seed

    console.log('Seeding data...');
    const seedSql = `
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
    await client.query(seedSql);
    console.log('✅ Success!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}
run();
