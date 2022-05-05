import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/payment-method.dtos';
import { PaymentMethod } from '../entities/payment-method.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  findAll() {
    return this.paymentMethodRepo.find();
  }

  findOne(id: string) {
    const paymentMethod = this.paymentMethodRepo.findOne(id);
    if (!paymentMethod) {
      throw new NotFoundException(`Payment Method #${id} not found`);
    }
    return paymentMethod;
  }

  create(data: CreatePaymentMethodDto) {
    const newPaymentMethod = this.paymentMethodRepo.create(data);
    return this.paymentMethodRepo.save(newPaymentMethod);
  }

  async update(id: string, changes: UpdatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodRepo.findOne(id);
    this.paymentMethodRepo.merge(paymentMethod, changes);
    return this.paymentMethodRepo.save(paymentMethod);
  }

  delete(id: string) {
    return this.paymentMethodRepo.delete(id);
  }
}
