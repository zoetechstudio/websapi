const { Client } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const farmData = [
  {
    name: 'Purnama Farm',
    image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
    description: 'Mitra utama IndoPalm Sapi. Pusat peternakan sapi qurban berkualitas, dirawat dengan prosedur standar tinggi dan pengawasan ketat.',
    badge: 'MITRA UTAMA IPS',
    stats_sapi: '120+', stats_luas: '4 Ha', stats_tahun: '2018',
    accent_color: '#8c6239'
  },
  {
    name: 'Nusantara Livestock',
    image_url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800',
    description: 'Peternakan modern berbasis teknologi dengan sistem pakan terstandarisasi. Sapi dipelihara secara alami di lahan hijau subur.',
    badge: 'MITRA RESMI IPS',
    stats_sapi: '85+', stats_luas: '3 Ha', stats_tahun: '2020',
    accent_color: '#64748b'
  },
  {
    name: 'Berkah Tani Farm',
    image_url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
    description: 'Peternakan berbasis komunitas lokal dengan sertifikasi halal. Menjamin kesehatan hewan dan standar syariat yang terjaga.',
    badge: 'MITRA RESMI IPS',
    stats_sapi: '60+', stats_luas: '2.5 Ha', stats_tahun: '2021',
    accent_color: '#7a5232'
  }
];

async function run() {
  try {
    await client.connect();
    for (const farm of farmData) {
      console.log(`Updating ${farm.name}...`);
      await client.query(`
        UPDATE farms SET 
          image_url = $1, 
          description = $2, 
          badge = $3, 
          stats_sapi = $4, 
          stats_luas = $5, 
          stats_tahun = $6, 
          accent_color = $7 
        WHERE name = $8
      `, [farm.image_url, farm.description, farm.badge, farm.stats_sapi, farm.stats_luas, farm.stats_tahun, farm.accent_color, farm.name]);
    }
    console.log('✅ Update successful!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}
run();
