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
  CreateClientServiceDto,
  FilterClientServiceDto,
  UpdateClientServiceDto,
} from '../dtos/client-service.dtos';
import { ClientServicesService } from '../services/client-services.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('client-services')
export class ClientServicesController {
  constructor(private clientServicesService: ClientServicesService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get()
  getAll(@Query() params: FilterClientServiceDto) {
    return this.clientServicesService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientServicesService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get('client/:clientId')
  getByClientId(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.clientServicesService.findByClientId(clientId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('')
  create(@Body() payload: CreateClientServiceDto) {
    return this.clientServicesService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateClientServiceDto,
  ) {
    return this.clientServicesService.update(id, payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.clientServicesService.delete(id);
  }
}
