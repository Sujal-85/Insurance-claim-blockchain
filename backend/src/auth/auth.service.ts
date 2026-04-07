import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(data: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        role: data.role || 'USER',
      },
    });

    return this.generateToken(user);
  }

  async login(data: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.passwordHash || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  async adminLogin(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate a real JWT token for admin
    return {
      ...this.generateToken(admin),
      role: 'ADMIN',
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            userPolicies: true,
            claims: true,
          } as any
        }
      } as any
    });

    if (!user) {
      throw new UnauthorizedException('User find failed');
    }

    // Calculate approval rate
    const approvedClaims = await this.prisma.claim.count({
      where: { userId, status: 'APPROVED' }
    });

    const userAny = user as any;
    return {
      ...user,
      activePolicies: userAny._count?.userPolicies || 0,
      totalClaims: userAny._count?.claims || 0,
      approvalRate: userAny._count?.claims > 0 ? Math.round((approvedClaims / userAny._count.claims) * 100) : 0
    };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
