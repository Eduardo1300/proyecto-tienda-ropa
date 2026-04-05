const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://tienda_db_0rhl_user:MgdRVS5Kn30WuQM64u7ZHBANrleLh0eb@dpg-d6d3kpsr85hc73bkaoa0-a.oregon-postgres.render.com/tienda_db_0rhl'
});

async function seedUsers() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    const query = `
      INSERT INTO "user" (username, email, password, firstName, lastName, role) 
      VALUES 
        ('admin', 'admin@example.com', '$2b$10$PKgpp6/PYkxSUwX5crYbZuqnuOhw4ImFQDfqqkE0o6ZSrKg7JDbxu', 'Admin', 'User', 'admin'),
        ('testuser', 'test@example.com', '$2b$10$PKgpp6/PYkxSUwX5crYbZuqnuOhw4ImFQDfqqkE0o6ZSrKg7JDbxu', 'Test', 'User', 'user'),
        ('customer', 'customer@example.com', '$2b$10$PKgpp6/PYkxSUwX5crYbZuqnuOhw4ImFQDfqqkE0o6ZSrKg7JDbxu', 'Customer', 'Test', 'user')
      ON CONFLICT (email) DO NOTHING;
    `;

    const result = await client.query(query);
    console.log('✅ Inserted users:', result.rowCount);

    const selectResult = await client.query('SELECT id, username, email, role FROM "user" ORDER BY id;');
    console.log('\n📋 Users in database:');
    console.table(selectResult.rows);

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedUsers();
