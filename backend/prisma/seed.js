const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = 'Password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Helper to ensure user exists
  const ensureUser = async (email, data) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      return await prisma.user.create({ data: { email, ...data } });
    }
    return existing;
  };

  // Create test user
  await ensureUser('user@example.com', {
    passwordHash: hashedPassword,
    name: 'Test User',
    role: 'USER',
  });
  console.log('Test User ensured: user@example.com');

  // Create test admin in User table
  await ensureUser('admin@example.com', {
    passwordHash: hashedPassword,
    name: 'System Admin',
    role: 'ADMIN',
  });
  console.log('Admin ensured: admin@example.com');

  // Create in Admin table
  const existingAdmin = await prisma.admin.findUnique({ where: { email: 'admin@example.com' } });
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
    });
  }
  console.log('Admin in Admin table ensured: admin@example.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
