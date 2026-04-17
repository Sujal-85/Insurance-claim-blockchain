import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClaimsModule } from './claims/claims.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { PoliciesModule } from './policies/policies.module';

@Module({
  imports: [AuthModule, PrismaModule, ClaimsModule, BlockchainModule, PoliciesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
