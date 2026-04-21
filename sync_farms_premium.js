const { Client } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    
    // 1. Reassign all products to Farm ID 1 (Purnama Farm) temporarily to avoid FK errors
    console.log('Reassigning products...');
    await client.query("UPDATE products SET farm_id = 1");

    // 2. Delete all farms except 1, 2, 3
    console.log('Deleting extra farms...');
    await client.query("DELETE FROM farms WHERE id NOT IN (1, 2, 3)");

    // 3. Update 1, 2, 3 with premium data
    console.log('Updating premium farms...');
    const farmData = [
      {
        id: 1,
        name: 'Purnama Farm',
        location: 'Bogor, Jawa Barat',
        image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
        description: 'Mitra utama IndoPalm Sapi. Pusat peternakan sapi qurban berkualitas, dirawat dengan prosedur standar tinggi dan pengawasan ketat.',
        badge: 'MITRA UTAMA IPS',
        stats_sapi: '120+', stats_luas: '4 Ha', stats_tahun: '2018',
        accent_color: '#8c6239'
      },
      {
        id: 2,
        name: 'Nusantara Livestock',
        location: 'Malang, Jawa Timur',
        image_url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800',
        description: 'Peternakan modern berbasis teknologi dengan sistem pakan terstandarisasi. Sapi dipelihara secara alami di lahan hijau subur.',
        badge: 'MITRA RESMI IPS',
        stats_sapi: '85+', stats_luas: '3 Ha', stats_tahun: '2020',
        accent_color: '#64748b'
      },
      {
        id: 3,
        name: 'Berkah Tani Farm',
        location: 'Banyuwangi, Jawa Timur',
        image_url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
        description: 'Peternakan berbasis komunitas lokal dengan sertifikasi halal. Menjamin kesehatan hewan dan standar syariat yang terjaga.',
        badge: 'MITRA RESMI IPS',
        stats_sapi: '60+', stats_luas: '2.5 Ha', stats_tahun: '2021',
        accent_color: '#7a5232'
      }
    ];

    for (const f of farmData) {
      await client.query(`
        UPDATE farms SET 
          name = $1, location = $2, image_url = $3, description = $4, badge = $5, 
          stats_sapi = $6, stats_luas = $7, stats_tahun = $8, accent_color = $9 
        WHERE id = $10
      `, [f.name, f.location, f.image_url, f.description, f.badge, f.stats_sapi, f.stats_luas, f.stats_tahun, f.accent_color, f.id]);
    }

    console.log('✅ Synchronized with premium data!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}
run();
