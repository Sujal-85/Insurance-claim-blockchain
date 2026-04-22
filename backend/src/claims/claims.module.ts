import { Module } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { ClaimsController } from './claims.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AIService } from './ai.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClaimsController],
  providers: [ClaimsService, AIService],
  exports: [ClaimsService],
})
export class ClaimsModule {}
