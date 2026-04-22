
import { AIService } from './claims/ai.service';
import { PrismaService } from './prisma/prisma.service';

async function testPersistence() {
  console.log('Testing AI Analysis Persistence...');
  
  // Mock services
  const prisma = new PrismaService();
  const aiService = new AIService();
  
  const testDescription = "My car was hit by a falling tree branch during a heavy storm in Mumbai last night. The windshield is shattered and there's a large dent on the hood.";
  const testAmount = 50000;
  const testType = "Car Insurance";
  const testLocation = "Mumbai, India";

  try {
    console.log('1. Generating AI Analysis...');
    const analysis = await aiService.getClaimAnalysis(testDescription, testAmount, testType, testLocation);
    console.log('Analysis Result:', JSON.stringify(analysis, null, 2));

    console.log('2. Finding a test user and policy...');
    const user = await (prisma as any).user.findFirst();
    const policy = await (prisma as any).userPolicy.findFirst({ where: { active: true } });

    if (!user || !policy) {
      console.error('No user or active policy found in DB. Please run seed first.');
      return;
    }

    console.log(`Using User: ${user.email}, Policy ID: ${policy.id}`);

    console.log('3. Creating test claim with AI verification...');
    const claim = await (prisma as any).claim.create({
      data: {
        userId: user.id,
        userPolicyId: policy.id,
        amount: testAmount,
        description: testDescription,
        incidentType: testType,
        incidentDate: new Date(),
        location: testLocation,
        status: 'PENDING',
        aiRiskScore: analysis.riskScore,
        blockchainClaimId: `TEST-${Date.now()}`,
        aiVerification: {
          create: {
            fraudScore: analysis.riskScore,
            authenticity: analysis.authenticity,
            policyCoverage: analysis.policyCoverage,
            explanation: analysis.analysis,
          }
        }
      },
      include: {
        aiVerification: true
      }
    });

    console.log('4. Verification successful!');
    console.log('Created Claim ID:', claim.id);
    console.log('AI Verification Record:', JSON.stringify(claim.aiVerification, null, 2));

    // Cleanup
    // await (prisma as any).aI_Verification.delete({ where: { claimId: claim.id } });
    // await (prisma as any).claim.delete({ where: { id: claim.id } });
    // console.log('Cleanup done.');

  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPersistence();
