import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import {
  CreateServicePlanDto,
  UpdateServicePlanDto,
} from '../dtos/service-plan.dtos';
import { ServicePlansService } from '../services/service-plans.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(ApiKeyGuard)
@UseGuards(JwtAuthGuard)
@Controller('service-plans')
export class ServicePlansController {
  constructor(private servicePlansService: ServicePlansService) {}

  @Get()
  getAll() {
    return this.servicePlansService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicePlansService.findOne(id);
  }

  @Post('')
  create(@Body() payload: CreateServicePlanDto) {
    return this.servicePlansService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateServicePlanDto,
  ) {
    return this.servicePlansService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.servicePlansService.delete(id);
  }
}
