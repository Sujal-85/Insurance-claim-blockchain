import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private blockchainService: BlockchainService,
  ) {}

  async signup(data: SignupDto) {
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
        walletAddress: data.walletAddress,
        phoneNumber: data.phoneNumber,
      },
    });

    return this.generateToken(user);
  }

  async login(data: LoginDto) {
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
    const tokenData = this.generateToken(admin);
    return {
      ...tokenData,
      role: 'ADMIN',
    };
  }

  async getUserProfile(userId: string, role?: string) {
    // If role is ADMIN, or we don't know the role, check Admin collection
    if (role === 'ADMIN') {
      const admin = await this.prisma.admin.findUnique({
        where: { id: userId }
      });
      if (admin) {
        return {
          ...admin,
          name: 'Administrator',
          activePolicies: 0,
          totalClaims: 0,
          approvalRate: 0,
          balance: 0
        };
      }
    }

    // Default to User collection
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
      // If not found in User and we didn't check Admin yet, try Admin
      const admin = await this.prisma.admin.findUnique({
        where: { id: userId }
      });
      
      if (admin) {
        return {
          id: admin.id,
          email: admin.email,
          name: 'Administrator',
          role: 'ADMIN',
          activePolicies: 0,
          totalClaims: 0,
          approvalRate: 0,
          balance: 0
        };
      }
      throw new UnauthorizedException('User profile not found');
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
      approvalRate: userAny._count?.claims > 0 ? Math.round((approvedClaims / userAny._count.claims) * 100) : 0,
      balance: user.balance || 0
    };
  }

  async withdraw(userId: string, amount: number, walletAddress?: string, signature?: string, message?: string) {
    if (!amount || amount <= 0) {
      throw new UnauthorizedException('Invalid withdrawal amount');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if ((user.balance || 0) < amount) {
      throw new UnauthorizedException(`Insufficient balance. Available: $${user.balance || 0}`);
    }

    const targetWallet = walletAddress || user.walletAddress;
    if (!targetWallet) {
      throw new UnauthorizedException('No wallet address provided or associated with account');
    }

    // Mandatory signature verification if wallet is linked or provided
    if (user.walletAddress || walletAddress) {
      if (!signature || !message) {
        throw new UnauthorizedException('Blockchain verification signature required for withdrawal');
      }
      const isValid = await this.blockchainService.verifySignature(message, signature, targetWallet);
      if (!isValid) {
        throw new UnauthorizedException('Invalid blockchain signature. Verification failed.');
      }
    }

    // Deduct balance
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Here you would typically trigger a blockchain transaction to send ETH/USDC
    // For now, we just record the withdrawal
    console.log(`Withdrawal of $${amount} to wallet ${targetWallet} for user ${user.email}`);

    return {
      message: 'Withdrawal successful',
      amount,
      walletAddress: targetWallet,
      newBalance: updatedUser.balance,
    };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name || (user.role === 'ADMIN' ? 'Administrator' : 'User'),
        role: user.role,
        balance: user.balance || 0,
      },
    };
  }
  async updateProfile(userId: string, data: UpdateProfileDto, signature?: string, message?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // If changing wallet address, verify signature of the new address
    if (data.walletAddress && data.walletAddress !== user.walletAddress) {
      if (!signature || !message) {
        throw new UnauthorizedException('Blockchain signature required to link a new wallet address');
      }
      const isValid = await this.blockchainService.verifySignature(message, signature, data.walletAddress);
      if (!isValid) {
        throw new UnauthorizedException('Invalid blockchain signature for the new wallet address');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        walletAddress: data.walletAddress,
        phoneNumber: data.phoneNumber,
        address: data.address,
      },
    });
    return updatedUser;
  }
}
