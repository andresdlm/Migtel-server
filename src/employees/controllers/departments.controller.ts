import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { DepartmentsService } from '../services/departments.service';
import {
  CreateDepartmentDto,
  FilterDepartmentDto,
  UpdateDepartmentDto,
} from '../dtos/department.dtos';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('deparments')
export class DeparmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Roles(Role.SUPER_ADMIN, Role.SUPER_ADMIN)
  @Get()
  findAll(@Query() params: FilterDepartmentDto) {
    return this.departmentsService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() payload: CreateDepartmentDto) {
    return this.departmentsService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, payload);
  }
}
