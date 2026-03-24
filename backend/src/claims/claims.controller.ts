import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assume we create this
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('claims')
@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new insurance claim' })
  async create(@Body() createClaimDto: CreateClaimDto) {
    // For now, using a mock userId until JWT guard is fully wired
    const mockUserId = "69afa83e19c9f31b2548a8cb"; // The test user id from seeding
    return this.claimsService.create(mockUserId, createClaimDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all claims (Admin view)' })
  async findAll() {
    return this.claimsService.findAll();
  }

  @Get('my-claims')
  @ApiOperation({ summary: 'Get claims for the logged-in user' })
  async findUserClaims() {
    const mockUserId = "69afa83e19c9f31b2548a8cb";
    return this.claimsService.findUserClaims(mockUserId);
  }

  @Post(':id/status')
  @ApiOperation({ summary: 'Update claim status (Admin action)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('reason') reason: string,
  ) {
    return this.claimsService.updateStatus(id, status, reason);
  }
}
