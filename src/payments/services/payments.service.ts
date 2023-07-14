import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';

import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';
import { Payment } from '../entities/payment.entity';
import {
  CreatePaymentDto,
  FilterPaymentDto,
  UpdatePaymentDTO,
} from '../dtos/payment.dtos';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private paymentMethodService: PaymentMethodsService,
  ) {}

  async findAll(params?: FilterPaymentDto) {
    if (params) {
      const { limit, offset } = params;
      return await this.paymentRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        relations: {
          paymentMethod: true,
        },
      });
    }
    return await this.paymentRepo.find({
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    const payment = this.paymentRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        user: {
          employee: true,
        },
        paymentMethod: true,
      },
    });
    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }
    return payment;
  }

  getCount() {
    return this.paymentRepo.count();
  }

  async search(searchInput: string) {
    if (isNumber(Number(searchInput))) {
      return this.paymentRepo.find({
        where: [{ clientId: Number(searchInput) }],
        take: 20,
        relations: {
          paymentMethod: true,
        },
      });
    }
  }

  async create(data: CreatePaymentDto) {
    const newPayment = this.paymentRepo.create(data);

    const paymentMethod = await this.paymentMethodService.findByCrmId(
      data.paymentMethodCrmId,
    );
    newPayment.paymentMethodId = paymentMethod.id;
    newPayment.paymentMethod = paymentMethod;
    return await this.paymentRepo.save(newPayment);
  }

  async update(id: number, changes: UpdatePaymentDTO) {
    const payment = await this.findOne(id);
    this.paymentRepo.merge(payment, changes);
    return await this.paymentRepo.save(payment);
  }

  async delete(id: number) {
    return this.paymentRepo.delete(id);
  }
}
