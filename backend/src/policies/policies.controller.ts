import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('policies')
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active policies' })
  async findAll() {
    return this.policiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy by ID' })
  async findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/purchase')
  @ApiOperation({ summary: 'Purchase a policy' })
  async purchase(@Param('id') id: string, @Request() req: any) {
    return this.policiesService.purchase(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('user/my-policies')
  @ApiOperation({ summary: 'Get policies purchased by the user' })
  async findUserPolicies(@Request() req: any) {
    return this.policiesService.findUserPolicies(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new policy (Admin)' })
  async create(@Body() data: any) {
    return this.policiesService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a policy (Admin)' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.policiesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a policy (Admin)' })
  async remove(@Param('id') id: string) {
    return this.policiesService.remove(id);
  }
}
