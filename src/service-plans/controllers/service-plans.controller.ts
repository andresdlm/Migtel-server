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
  CreateServicePlanDto,
  UpdateServicePlanDto,
} from '../dtos/service-plans.dtos';
import { ServicePlansService } from '../services/service-plans.service';

@Controller('service-plans')
export class ServicePlansController {
  constructor(private servicePlansService: ServicePlansService) {}

  @Get()
  getAll() {
    return this.servicePlansService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicePlansService.findOne(id);
  }

  @Post('')
  create(@Body() payload: CreateServicePlanDto) {
    return this.servicePlansService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateServicePlanDto,
  ) {
    return this.servicePlansService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.servicePlansService.delete(id);
  }
}
