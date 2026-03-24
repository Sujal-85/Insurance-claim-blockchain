import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoliciesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.policy.findMany({
      where: { active: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.policy.findUnique({
      where: { id },
    });
  }
}
