import { Controller, Post, Get, Body, Param, UseGuards, Request, InternalServerErrorException } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('claims')
@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Submit a new insurance claim' })
  async create(@Body() createClaimDto: CreateClaimDto, @Request() req: any) {
    try {
      console.log('Received claim submission for user:', req.user.userId);
      console.log('DTO:', createClaimDto);
      return await this.claimsService.create(req.user.userId, createClaimDto);
    } catch (error) {
      console.error('Error in ClaimsController.create:', error);
      if (error.status) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all claims (Admin view)' })
  async findAll() {
    return this.claimsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('stats')
  @ApiOperation({ summary: 'Get claims statistics (Analytics)' })
  async getStats() {
    return this.claimsService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-claims')
  @ApiOperation({ summary: 'Get claims for the logged-in user' })
  async findUserClaims(@Request() req: any) {
    return this.claimsService.findUserClaims(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get claim by ID' })
  async findOne(@Param('id') id: string) {
    return this.claimsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/status')
  @ApiOperation({ summary: 'Update claim status (Admin action)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('reason') reason: string,
    @Body('signature') signature: string,
    @Body('message') message: string,
    @Request() req: any,
  ) {
    return this.claimsService.updateStatus(id, status, reason, req.user.userId, signature, message);
  }
}
