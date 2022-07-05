import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreatePaymentMethodDto,
  FilterPaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/payment-method.dtos';
import { PaymentMethodsService } from '../services/payment-methods.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private paymentMethodService: PaymentMethodsService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get()
  getAll(
    @Query() params: FilterPaymentMethodDto,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    params.getArchive = getArchive;
    return this.paymentMethodService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('')
  create(@Body() payload: CreatePaymentMethodDto) {
    return this.paymentMethodService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodService.update(id, payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('archive/:id')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodService.archive(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodService.delete(id);
  }
}
