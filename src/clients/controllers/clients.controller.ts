import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  CreateClientDto,
  UpdateClientDto,
  FilterClientDto,
} from '../dtos/client.dtos';
import { ClientsService } from './../services/clients.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get()
  getAll(
    @Query() params: FilterClientDto,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    params.getArchive = getArchive;
    return this.clientsService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('count')
  getCount(@Query('getArchive', ParseBoolPipe) getArchive: boolean) {
    return this.clientsService.getCount(getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('search')
  search(
    @Query('searchParam') searchParam: string,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    return this.clientsService.search(searchParam, getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('')
  create(@Body() payload: CreateClientDto) {
    return this.clientsService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateClientDto,
  ) {
    return this.clientsService.update(id, payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Delete('archive/:id')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.archive(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.delete(id);
  }
}
