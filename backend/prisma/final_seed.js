const { MongoClient } = require('mongodb');

async function seed() {
  require('dotenv').config();
  const url = process.env.DATABASE_URL || 'mongodb://localhost:27017';
  
  // Extract DB name from connection string if possible
  let dbName = 'Insurance';
  if (url.includes('.net/')) {
    const parts = url.split('.net/')[1].split('?');
    if (parts[0]) dbName = parts[0];
  } else if (url.includes('localhost:27017/')) {
    dbName = url.split('localhost:27017/')[1].split('?')[0];
  }
  
  console.log(`Targeting database: ${dbName}`);
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    
    const hash = '$2b$10$FUg9pQsCjYVj6OhX.l8jNOUe3Uj4M.8NMq8GimX4m1eNZe.Q3bfcC'; // password123
    const adminHash = '$2b$10$5b7W3VF0K2o6/PI.l83lc.CWVR0QiEjJ3QNJpSPUe5hdGLfNohGZ.'; // admin@123
    
    // Cleanup
    await db.collection('User').deleteMany({});
    await db.collection('Admin').deleteMany({});
    await db.collection('Policy').deleteMany({});
    await db.collection('UserPolicy').deleteMany({});
    await db.collection('Claim').deleteMany({});
    await db.collection('AI_Verification').deleteMany({});
    
    // Seed Policies
    const policies = await db.collection('Policy').insertMany([
      {
        policyName: 'Premium Health Coverage',
        description: 'Comprehensive health insurance with worldwide coverage.',
        category: 'Health',
        coverageAmount: 50000,
        premium: 200,
        rules: { minAge: 18, maxAge: 65 },
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        policyName: 'Auto Safe Plus',
        description: 'Advanced auto insurance with AI-driven risk assessment.',
        category: 'Auto',
        coverageAmount: 25000,
        premium: 150,
        rules: { vehicleType: 'Passenger' },
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const policyId = policies.insertedIds[0];
    
    // Seed Users
    const users = await db.collection('User').insertMany([
      {
        email: 'admin@example.com',
        passwordHash: adminHash,
        name: 'System Admin',
        role: 'ADMIN',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'test@example.com',
        passwordHash: hash,
        name: 'Test User',
        role: 'USER',
        walletAddress: '0x1234567890123456789012345678901234567890',
        balance: 1500.50, // Starting balance
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Seed Admin Collection
    await db.collection('Admin').insertOne({
      email: 'admin@example.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const userId = users.insertedIds[1];

    // Seed UserPolicy
    const userPolicies = await db.collection('UserPolicy').insertMany([
      {
        userId: userId,
        policyId: policyId,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        premiumPaid: 200,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const userPolicyId = userPolicies.insertedIds[0];

    // Seed an Approved Claim
    const claims = await db.collection('Claim').insertMany([
      {
        userId: userId,
        userPolicyId: userPolicyId,
        amount: 500.00,
        description: 'Medical checkup and emergency visit',
        incidentType: 'Emergency',
        incidentDate: new Date(),
        location: 'City General Hospital',
        status: 'APPROVED',
        aiRiskScore: 12,
        blockchainStatus: 'CONFIRMED',
        blockchainTxHash: '0xabc123...',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const claimId = claims.insertedIds[0];

    // Seed AI Verification
    await db.collection('AI_Verification').insertOne({
      claimId: claimId,
      fraudScore: 12,
      explanation: 'Low risk claim. Documentation matches incident report.',
      createdAt: new Date()
    });
    
    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seed();
