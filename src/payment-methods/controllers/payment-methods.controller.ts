import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/payment-method.dtos';
import { PaymentMethodsService } from '../services/payment-methods.service';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private paymentMethodService: PaymentMethodsService) {}

  @Get()
  getAll() {
    return this.paymentMethodService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.paymentMethodService.findOne(id);
  }

  @Post('')
  create(@Body() payload: CreatePaymentMethodDto) {
    return this.paymentMethodService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdatePaymentMethodDto) {
    return this.paymentMethodService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.paymentMethodService.delete(id);
  }
}
