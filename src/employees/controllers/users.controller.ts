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

import { UsersService } from '../services/users.service';
import {
  CreateUserDto,
  FilterUsersDto,
  UpdateUserDto,
} from '../dtos/user.dtos';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get()
  findAll(
    @Query() params: FilterUsersDto,
    @Query('getActive', ParseBoolPipe) getActive: boolean,
  ) {
    params.getActive = getActive;
    return this.usersService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('count')
  getCount(@Query('getActive', ParseBoolPipe) getActive: boolean) {
    return this.usersService.getCount(getActive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('search')
  search(@Query('searchParam') searchParam: string) {
    return this.usersService.search(searchParam);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.update(id, payload);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete('activate/:id')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.activate(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
