const { MongoClient } = require('mongodb');

async function seed() {
  const url = 'mongodb://localhost:27017';
  const dbName = 'secure-chain-claims';
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    
    const hash = '$2b$10$FUg9pQsCjYVj6OhX.l8jNOUe3Uj4M.8NMq8GimX4m1eNZe.Q3bfcC';
    
    // Cleanup
    await db.collection('User').deleteMany({});
    await db.collection('Admin').deleteMany({});
    
    // Seed Users
    await db.collection('User').insertMany([
      {
        email: 'admin@example.com',
        passwordHash: hash,
        name: 'System Admin',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'test@example.com',
        passwordHash: hash,
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Seed Admins
    await db.collection('Admin').insertMany([
      {
        email: 'admin@realtycheck.ai',
        passwordHash: hash,
        name: 'Root Admin',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seed();
