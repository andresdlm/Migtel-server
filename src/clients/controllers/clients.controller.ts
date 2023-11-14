import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateClientDto, FilterClientDto } from '../dtos/client.dtos';
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
  getAll(@Query() params: FilterClientDto) {
    return this.clientsService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('searchCrmClients')
  searchCrmClients(@Query('query') query: string) {
    return this.clientsService.searchCRMClients(query);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('services')
  getCrmClientsServices(@Query('clientId') clientId: string) {
    return this.clientsService.getCRMClientsServices(clientId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('')
  create(@Body() payload: CreateClientDto) {
    return this.clientsService.createOrUpdate(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.delete(id);
  }
}
