const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@example.com' }
    });
    console.log('Admin found:', admin ? 'Yes' : 'No');
    if (admin) {
      console.log('Admin data:', JSON.stringify(admin, null, 2));
    }
  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
