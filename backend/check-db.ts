import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClaims() {
  console.log('--- Checking Latest Claims ---');
  try {
    const claims = await prisma.claim.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        aiVerification: true
      }
    });

    claims.forEach(claim => {
      console.log(`Claim ID: ${claim.id}`);
      console.log(`Created At: ${claim.createdAt}`);
      console.log(`Status: ${claim.status}`);
      console.log(`Blockchain Status: ${claim.blockchainStatus}`);
      console.log(`Risk Score: ${claim.aiRiskScore}`);
      if (claim.aiVerification) {
        console.log(`AI Verification: Found`);
        console.log(`  Authenticity: ${claim.aiVerification.authenticity}`);
        console.log(`  Policy Coverage: ${claim.aiVerification.policyCoverage}`);
        console.log(`  Explanation: ${claim.aiVerification.explanation}`);
      } else {
        console.log(`AI Verification: NOT FOUND`);
      }
      console.log('---------------------------');
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClaims();
