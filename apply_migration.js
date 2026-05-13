const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  connectionString: 'postgresql://postgres.ghxniuszzksnswbnsrlj:Irza520408301@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected to new Supabase database!');
    
    const sql = fs.readFileSync('supabase_migration.sql', 'utf8');
    
    console.log('⏳ Running migration script...');
    await client.query(sql);
    
    console.log('✨ Migration executed successfully! Tables created and data seeded.');
  } catch (err) {
    console.error('❌ Error executing migration:', err.message);
  } finally {
    await client.end();
  }
}

run();
