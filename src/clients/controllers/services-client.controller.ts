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
  CreateServiceClientDto,
  UpdateServiceClientDto,
} from '../dtos/service-clients.dtos';
import { ServicesClientService } from '../services/services-client.service';

@Controller('services-client')
export class ServicesClientController {
  constructor(private servicesClientService: ServicesClientService) {}

  @Get()
  getAll() {
    return this.servicesClientService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesClientService.findOne(id);
  }

  @Post('')
  create(@Body() payload: CreateServiceClientDto) {
    return this.servicesClientService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateServiceClientDto,
  ) {
    return this.servicesClientService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.servicesClientService.delete(id);
  }
}
