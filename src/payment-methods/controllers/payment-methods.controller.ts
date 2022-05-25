import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/payment-method.dtos';
import { PaymentMethodsService } from '../services/payment-methods.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(ApiKeyGuard)
@UseGuards(JwtAuthGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private paymentMethodService: PaymentMethodsService) {}

  @Get()
  getAll() {
    return this.paymentMethodService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodService.findOne(id);
  }

  @Post('')
  create(@Body() payload: CreatePaymentMethodDto) {
    return this.paymentMethodService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodService.delete(id);
  }
}
