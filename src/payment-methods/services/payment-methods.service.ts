import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreatePaymentMethodDto,
  FilterPaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/payment-method.dtos';
import { PaymentMethod } from '../entities/payment-method.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  findAll(params?: FilterPaymentMethodDto) {
    if (params) {
      const { limit, offset } = params;
      return this.paymentMethodRepo.find({
        relations: ['invoices'],
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
      });
    }
    return this.paymentMethodRepo.find({
      relations: ['invoices'],
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
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

  async update(id: number, changes: UpdatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodRepo.findOne(id);
    this.paymentMethodRepo.merge(paymentMethod, changes);
    return this.paymentMethodRepo.save(paymentMethod);
  }

  delete(id: number) {
    return this.paymentMethodRepo.delete(id);
  }
}
