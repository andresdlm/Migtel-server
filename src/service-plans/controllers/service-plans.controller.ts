import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  CreateServicePlanDto,
  FilterServicePlanDto,
  UpdateServicePlanDto,
} from '../dtos/service-plan.dtos';
import { ServicePlansService } from '../services/service-plans.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('service-plans')
export class ServicePlansController {
  constructor(private servicePlansService: ServicePlansService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get()
  getAll(@Query() params: FilterServicePlanDto) {
    return this.servicePlansService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicePlansService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('')
  create(@Body() payload: CreateServicePlanDto) {
    return this.servicePlansService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateServicePlanDto,
  ) {
    return this.servicePlansService.update(id, payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.servicePlansService.delete(id);
  }
}
