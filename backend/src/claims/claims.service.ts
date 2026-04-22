import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { BlockchainService } from '../blockchain/blockchain.service';
import { AIService } from './ai.service';

@Injectable()
export class ClaimsService {
  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
    private aiService: AIService,
  ) {}

  async create(userId: string, createClaimDto: CreateClaimDto) {
    // Check if user has an active policy (UserPolicy) for the requested policy
    const userPolicy = await (this.prisma as any).userPolicy.findFirst({
      where: { 
        userId, 
        policyId: createClaimDto.policyId,
        active: true,
      },
    });

    if (!userPolicy) {
      throw new NotFoundException('Active policy not found for this user');
    }

    // Perform Full AI Analysis
    const analysis = await this.aiService.getClaimAnalysis(
      createClaimDto.description,
      createClaimDto.amount,
      createClaimDto.incidentType,
      createClaimDto.location,
    );

    // Generate blockchain claim ID if not provided by frontend
    const blockchainClaimId = createClaimDto.blockchainClaimId || `CLAIM-${Date.now()}`;

    const claim = await (this.prisma as any).claim.create({
      data: {
        userId,
        userPolicyId: userPolicy.id,
        amount: createClaimDto.amount,
        description: createClaimDto.description,
        incidentType: createClaimDto.incidentType,
        incidentDate: new Date(createClaimDto.incidentDate),
        location: createClaimDto.location,
        status: 'PENDING',
        aiRiskScore: analysis.riskScore,
        blockchainTxHash: createClaimDto.blockchainTxHash,
        blockchainClaimId: blockchainClaimId,
        blockchainStatus: createClaimDto.blockchainTxHash ? 'CONFIRMED' : 'PENDING',
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

    // Optional: Record claim on blockchain if not already done by frontend
    if (!createClaimDto.blockchainTxHash) {
      console.log('No frontend hash, attempting backend blockchain submission for claim:', blockchainClaimId);
      try {
        await this.blockchainService.submitClaim(blockchainClaimId, createClaimDto.policyId, claim.amount.toString());
      } catch (e) {
        console.warn('Blockchain submission failed, but DB record saved:', e.message);
      }
    } else {
      console.log('Frontend provided hash, skipping backend blockchain submission:', createClaimDto.blockchainTxHash);
    }

    return {
      message: 'Claim submitted successfully',
      claim,
    };
  }

  async findAll() {
    return this.prisma.claim.findMany({
      include: {
        user: { 
          select: { 
            name: true, 
            email: true,
            walletAddress: true 
          } 
        },
        userPolicy: {
          include: {
            policy: true
          }
        },
        aiVerification: true,
      } as any,
    });
  }

  async findUserClaims(userId: string) {
    return this.prisma.claim.findMany({
      where: { userId },
      include: { 
        userPolicy: {
          include: {
            policy: true
          }
        },
        aiVerification: true
      } as any,
    });
  }

  async findOne(id: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
      include: {
        user: { 
          select: { 
            name: true, 
            email: true,
            walletAddress: true 
          } 
        },
        userPolicy: {
          include: {
            policy: true
          }
        },
        aiVerification: true,
      } as any,
    });

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    return claim;
  }

  async getStats() {
    const totalClaims = await this.prisma.claim.count();
    const approvedClaims = await this.prisma.claim.count({ where: { status: 'APPROVED' } });
    const rejectedClaims = await this.prisma.claim.count({ where: { status: 'REJECTED' } });
    const pendingReview = await this.prisma.claim.count({ where: { status: { in: ['PENDING', 'AI_VERIFIED'] } } });
    const activePolicies = await (this.prisma as any).userPolicy.count({ where: { active: true } });
    
    const payouts = await this.prisma.claim.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true }
    });

    const avgRisk = await this.prisma.claim.aggregate({
      _avg: { aiRiskScore: true }
    });

    // Get last 6 months trend
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const claims = await this.prisma.claim.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { status: true, amount: true, createdAt: true }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = months[d.getMonth()];
      const monthNum = d.getMonth();
      const yearNum = d.getFullYear();

      const monthClaims = claims.filter(c => {
        const cDate = new Date(c.createdAt);
        return cDate.getMonth() === monthNum && cDate.getFullYear() === yearNum;
      });

      monthlyData.push({
        month: monthLabel,
        claims: monthClaims.length,
        approved: monthClaims.filter(c => c.status === 'APPROVED').length,
        rejected: monthClaims.filter(c => c.status === 'REJECTED').length,
        payout: monthClaims.filter(c => c.status === 'APPROVED').reduce((sum, c) => sum + (c.amount || 0), 0)
      });
    }

    return {
      totalClaims,
      activePolicies,
      pendingReview,
      approvedClaims,
      rejectedClaims,
      approvalRate: totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0,
      totalPayouts: payouts._sum.amount || 0,
      avgAIConfidence: 100 - (avgRisk._avg.aiRiskScore || 0), // Mock confidence as inverse of risk
      monthlyData
    };
  }

  async updateStatus(
    id: string,
    status: any,
    reason: string,
    adminId: string,
    signature?: string,
    message?: string,
  ) {
    // Get claim with user info for payout
    const claimWithUser = await this.prisma.claim.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!claimWithUser) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    // Verify Admin Signature
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      throw new Error('Admin not found');
    }

    if (admin.walletAddress) {
      if (!signature || !message) {
        throw new Error('Blockchain verification signature required for admin actions');
      }
      const isValid = await this.blockchainService.verifySignature(message, signature, admin.walletAddress);
      if (!isValid) {
        throw new Error('Invalid blockchain signature. Verification failed.');
      }
    }

    const claim = await this.prisma.claim.update({
      where: { id },
      data: { status },
    });

    // Create AI verification entry
    await this.prisma.aI_Verification.upsert({
      where: { claimId: id },
      create: {
        claimId: id,
        fraudScore: claim.aiRiskScore || 0,
        explanation: 'Manual Review',
        adminNotes: reason,
      },
      update: {
        adminNotes: reason,
      },
    });

    // Add payout to user balance if claim is approved
    if (status === 'APPROVED' && claimWithUser.userId) {
      try {
        // Atomic increment of user balance
        const updatedUser = await this.prisma.user.update({
          where: { id: claimWithUser.userId },
          data: {
            balance: {
              increment: claim.amount,
            },
          },
          select: { balance: true, email: true }
        });
        
        console.log(`Added $${claim.amount} to user ${updatedUser.email}. New balance: $${updatedUser.balance}`);
      } catch (e) {
        console.error('Failed to update user balance:', e.message);
      }
    }

    // Update status on blockchain using the blockchainClaimId
    try {
      const blockchainStatus = status === 'APPROVED' ? 2 : (status === 'REJECTED' ? 3 : 0);
      if (blockchainStatus !== 0 && claim.blockchainClaimId) {
        console.log(`Processing claim ${claim.blockchainClaimId} on blockchain with status ${blockchainStatus}`);
        const tx = await this.blockchainService.processClaim(claim.blockchainClaimId, blockchainStatus, reason);
        console.log('Blockchain transaction successful:', tx?.hash || (tx as any)?.transactionHash || 'Hash not available');
      } else {
        console.warn('Skipping blockchain update: no blockchainClaimId found for claim');
      }
    } catch (e) {
      console.error('Blockchain status update failed:', e.message);
      // Don't throw - database update is already done
    }

    return { ...claim, payoutProcessed: status === 'APPROVED' };
  }
}
