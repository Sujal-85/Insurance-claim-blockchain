import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupOrphanedUserPolicies() {
  console.log('--- Cleaning up orphaned UserPolicy records ---');
  
  const userPolicies = await prisma.userPolicy.findMany();
  let deletedCount = 0;

  for (const up of userPolicies) {
    const policy = await prisma.policy.findUnique({ where: { id: up.policyId } });
    if (!policy) {
      console.log(`Deleting orphaned UserPolicy ${up.id} (references non-existent Policy ${up.policyId})`);
      await prisma.userPolicy.delete({ where: { id: up.id } });
      deletedCount++;
    }
  }

  console.log(`Cleanup complete. Deleted ${deletedCount} orphaned records.`);
  await prisma.$disconnect();
}

cleanupOrphanedUserPolicies().catch(console.error);
