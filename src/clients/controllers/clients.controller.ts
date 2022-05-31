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
} from '@nestjs/common';
import { CreateClientDto, UpdateClientDto } from '../dtos/client.dtos';
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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get()
  getAll() {
    return this.clientsService.findAll();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('')
  create(@Body() payload: CreateClientDto) {
    return this.clientsService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateClientDto,
  ) {
    return this.clientsService.update(id, payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.delete(id);
  }
}
