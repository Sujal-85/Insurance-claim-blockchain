import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'Password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: hashedPassword,
      name: 'Test User',
      role: 'USER',
    },
  });
  console.log('Test User created:', user.email);

  // Create test admin
  // Since the schema has a separate Admin model, let's create one there too
  // But wait, if we want them to log in via the same service, it should be flexible.
  // Let's create an Admin in the User table as well, just in case.
  const adminInUserTable = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      name: 'System Admin',
      role: 'ADMIN',
    },
  });
  console.log('Admin in User table created:', adminInUserTable.email);

  // Also create in Admin table if necessary
  const adminInAdminTable = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin in Admin table created:', adminInAdminTable.email);

  // Create test policies
  const policies = [
    {
      policyName: 'Comprehensive Auto Insurance',
      coverageAmount: 50000,
      rules: { deductibles: 500, type: 'auto' },
    },
    {
      policyName: 'Premium Health Coverage',
      coverageAmount: 100000,
      rules: { deductibles: 0, type: 'health' },
    },
    {
      policyName: 'Home & Property Insurance',
      coverageAmount: 250000,
      rules: { deductibles: 1000, type: 'property' },
    },
  ];

  for (const policy of policies) {
    const createdPolicy = await prisma.policy.create({
      data: policy,
    });
    console.log('Policy created:', createdPolicy.policyName);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
