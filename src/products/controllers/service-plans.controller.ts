import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
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
import { LogInterceptor } from 'src/logger/interceptors/log.interceptor';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('service-plans')
export class ServicePlansController {
  constructor(private servicePlansService: ServicePlansService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get()
  getAll(
    @Query() params: FilterServicePlanDto,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    params.getArchive = getArchive;
    return this.servicePlansService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('orderByName')
  getAllOrderByName(
    @Query() params: FilterServicePlanDto,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    params.getArchive = getArchive;
    return this.servicePlansService.findAllOrderByName(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('count')
  getCount(@Query('getArchive', ParseBoolPipe) getArchive: boolean) {
    return this.servicePlansService.getCount(getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('search')
  search(
    @Query('searchParam') searchParam: string,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    return this.servicePlansService.search(searchParam, getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicePlansService.findOne(id);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('')
  create(@Body() payload: CreateServicePlanDto) {
    return this.servicePlansService.create(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateServicePlanDto,
  ) {
    return this.servicePlansService.update(id, payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('archive/:id')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.servicePlansService.archive(id);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.servicePlansService.delete(id);
  }
}
