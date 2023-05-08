import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';

import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto, FilterPaymentDto, UpdatePaymentDTO } from '../dtos/payment.dtos';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async findAll(params?: FilterPaymentDto) {
    if (params) {
      const { limit, offset } = params;
      return await this.paymentRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
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
      }
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
      });
    }
  }

  async create(data: CreatePaymentDto) {
    const newPayment = this.paymentRepo.create(data);
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
