import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('--- Checking UserPolicy records ---');
  const userPolicies = await prisma.userPolicy.findMany();
  console.log(`Found ${userPolicies.length} UserPolicy records.`);

  for (const up of userPolicies) {
    const policy = await prisma.policy.findUnique({ where: { id: up.policyId } });
    if (!policy) {
      console.error(`ERROR: UserPolicy ${up.id} references non-existent Policy ${up.policyId}`);
    } else {
      console.log(`OK: UserPolicy ${up.id} references Policy ${policy.policyName}`);
    }
  }

  console.log('--- Checking Policy records ---');
  const policies = await prisma.policy.findMany();
  console.log(`Found ${policies.length} Policy records.`);
  for (const p of policies) {
    console.log(`- Policy: ${p.id} (${p.policyName})`);
  }

  await prisma.$disconnect();
}

checkData().catch(console.error);
