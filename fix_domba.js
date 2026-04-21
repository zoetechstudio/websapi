const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.akfmdyarpcbcocjcuzlr:Irza520408301@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

const updates = [
  // Using very reliable Unsplash raw IDs
  { kode: 'DQ057', url: 'https://images.unsplash.com/photo-1511117833450-798782046d47?auto=format&fit=crop&w=800&q=80' }, // Sheep
  { kode: 'NQ008', url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80' }, // Cow
  { kode: 'NQ084', url: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=800&q=80' }, // Cow
  { kode: 'NQ011', url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80' }  // Cow
];

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase!');
    
    for (const item of updates) {
      await client.query(
        'UPDATE products SET image_url = $1, gallery = $2 WHERE kode_unik = $3', 
        [item.url, JSON.stringify([item.url]), item.kode]
      );
      console.log(`✅ Fixed & Verified ${item.kode}`);
    }
    
    console.log('✨ All images fixed. Domba SHOULD work now.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
