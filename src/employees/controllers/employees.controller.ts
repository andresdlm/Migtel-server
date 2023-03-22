import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';

import { EmployeesService } from '../services/employees.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  FilterEmployeeDto,
} from '../dtos/employee.dtos';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get()
  findAll(
    @Query() params: FilterEmployeeDto,
    @Query('getActive', ParseBoolPipe) getActive: boolean,
  ) {
    params.getActive = getActive;
    return this.employeesService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() payload: CreateEmployeeDto) {
    return this.employeesService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.archive(id);
  }
}
