import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class ClaimsService {
  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
  ) {}

  async create(userId: string, createClaimDto: CreateClaimDto) {
    // Check if policy exists and belongs to user
    const policy = await this.prisma.policy.findUnique({
      where: { id: createClaimDto.policyId },
    });

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    // In a real scenario, we'd verify the policy belongs to the user
    // For now, we'll just create the claim
    const claim = await this.prisma.claim.create({
      data: {
        userId,
        policyId: createClaimDto.policyId,
        amount: createClaimDto.amount,
        description: createClaimDto.description,
        incidentType: createClaimDto.incidentType,
        incidentDate: new Date(createClaimDto.incidentDate),
        location: createClaimDto.location,
        status: 'PENDING',
        aiRiskScore: Math.random() * 10,
      },
    });

    // Optional: Record claim on blockchain
    try {
      await this.blockchainService.submitClaim(claim.id, claim.policyId, claim.amount.toString());
    } catch (e) {
      console.warn('Blockchain submission failed, but DB record saved:', e.message);
    }

    return {
      message: 'Claim submitted successfully',
      claim,
    };
  }

  async findAll() {
    return this.prisma.claim.findMany({
      include: {
        user: { select: { name: true, email: true } },
        policy: true,
      },
    });
  }

  async findUserClaims(userId: string) {
    return this.prisma.claim.findMany({
      where: { userId },
      include: { policy: true },
    });
  }

  async updateStatus(id: string, status: any, reason: string) {
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
        explanation: reason,
      },
      update: {
        explanation: reason,
      },
    });

    // Update status on blockchain
    try {
      const blockchainStatus = status === 'APPROVED' ? 2 : (status === 'REJECTED' ? 3 : 0);
      if (blockchainStatus !== 0) {
        await this.blockchainService.processClaim(id, blockchainStatus, reason);
      }
    } catch (e) {
      console.warn('Blockchain status update failed:', e.message);
    }

    return claim;
  }
}
