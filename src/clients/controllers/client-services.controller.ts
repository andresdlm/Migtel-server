import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateClientServiceDto,
  UpdateClientServiceDto,
} from '../dtos/client-service.dtos';
import { ClientServicesService } from '../services/client-services.service';

@Controller('client-services')
export class ClientServicesController {
  constructor(private clientServicesService: ClientServicesService) {}

  @Get()
  getAll() {
    return this.clientServicesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientServicesService.findOne(id);
  }

  @Get('client/:clientId')
  getByClientId(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.clientServicesService.findByClientId(clientId);
  }

  @Post('')
  create(@Body() payload: CreateClientServiceDto) {
    return this.clientServicesService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateClientServiceDto,
  ) {
    return this.clientServicesService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.clientServicesService.delete(id);
  }
}
