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
  UseInterceptors,
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
import { LogInterceptor } from 'src/logger/interceptors/log.interceptor';

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
  @Get('count')
  getCount(@Query('getActive', ParseBoolPipe) getActive: boolean) {
    return this.employeesService.getCount(getActive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('without-user')
  findEmployeesWithoutUser() {
    return this.employeesService.findEmployeesWithoutUser();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('search')
  search(
    @Query('searchParam') searchParam: string,
    @Query('getActive', ParseBoolPipe) getActive: boolean,
  ) {
    return this.employeesService.search(searchParam, getActive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() payload: CreateEmployeeDto) {
    return this.employeesService.create(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.deactivate(id);
  }
}
