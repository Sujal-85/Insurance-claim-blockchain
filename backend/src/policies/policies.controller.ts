import { Controller, Get, Param } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

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
}
