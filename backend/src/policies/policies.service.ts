import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class PoliciesService {
  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
  ) {}

  async findAll() {
    return this.prisma.policy.findMany();
  }

  async findOne(id: string) {
    return this.prisma.policy.findUnique({
      where: { id },
    });
  }

  async purchase(userId: string, policyId: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId },
    });

    if (!policy) {
      throw new Error('Policy not found');
    }

    // Set end date to 1 year from now
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const userPolicy = await (this.prisma as any).userPolicy.create({
      data: {
        userId,
        policyId,
        endDate,
        premiumPaid: (policy as any).premium,
        active: true,
      },
    });

    // Record policy on blockchain to prevent "execution reverted" during claim submission
    try {
      await this.blockchainService.recordPolicy(
        userId,
        policyId,
        (policy as any).premium.toString()
      );
    } catch (e) {
      console.warn('Blockchain policy recording failed, but DB record saved:', e.message);
    }

    return userPolicy;
  }

  async findUserPolicies(userId: string) {
    return (this.prisma as any).userPolicy.findMany({
      where: { userId },
      include: {
        policy: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.policy.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.policy.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.policy.delete({
      where: { id },
    });
  }
}
