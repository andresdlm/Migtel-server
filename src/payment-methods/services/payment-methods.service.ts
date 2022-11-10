import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNumber } from 'class-validator';
import { ILike, Repository } from 'typeorm';

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
      const { limit, offset, getArchive } = params;
      return this.paymentMethodRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { archived: getArchive },
      });
    }
    return this.paymentMethodRepo.find({
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    const paymentMethod = this.paymentMethodRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!paymentMethod) {
      throw new NotFoundException(`Payment Method #${id} not found`);
    }
    return paymentMethod;
  }

  getCount(getArchive: boolean) {
    return this.paymentMethodRepo.count({
      where: { archived: getArchive },
    });
  }

  async search(searchInput: string, getArchive: boolean) {
    if (isNumber(Number(searchInput))) {
      return this.paymentMethodRepo.find({
        where: [
          { id: Number(searchInput), archived: getArchive },
          { coc: Number(searchInput), archived: getArchive },
        ],
        take: 20,
      });
    } else {
      return this.paymentMethodRepo.find({
        where: {
          name: ILike(`%${searchInput}%`),
        },
        take: 20,
      });
    }
  }

  create(data: CreatePaymentMethodDto) {
    const newPaymentMethod = this.paymentMethodRepo.create(data);
    return this.paymentMethodRepo.save(newPaymentMethod);
  }

  async update(id: number, changes: UpdatePaymentMethodDto) {
    const paymentMethod = await this.findOne(id);
    this.paymentMethodRepo.merge(paymentMethod, changes);
    return this.paymentMethodRepo.save(paymentMethod);
  }

  async archive(id: number) {
    const paymentMethod = await this.findOne(id);
    paymentMethod.archived = !paymentMethod.archived;
    return this.paymentMethodRepo.save(paymentMethod);
  }

  delete(id: number) {
    return this.paymentMethodRepo.delete(id);
  }
}
