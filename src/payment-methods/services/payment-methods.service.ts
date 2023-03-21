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

  async findAll(params?: FilterPaymentMethodDto) {
    if (params) {
      const { limit, offset, getArchive } = params;
      return await this.paymentMethodRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { archived: getArchive },
      });
    }
    return await this.paymentMethodRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const paymentMethod = await this.paymentMethodRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!paymentMethod) {
      throw new NotFoundException(`Payment Method #${id} not found`);
    }
    return paymentMethod;
  }

  async findByCrmId(crmId: string) {
    const paymentMethod = await this.paymentMethodRepo.findOne({
      where: {
        crmId: crmId,
      },
    });
    if (!paymentMethod) {
      throw new NotFoundException(`Payment Method #${crmId} not found`);
    }
    return paymentMethod;
  }

  async getCount(getArchive: boolean) {
    return await this.paymentMethodRepo.count({
      where: { archived: getArchive },
    });
  }

  async search(searchInput: string, getArchive: boolean) {
    if (isNumber(Number(searchInput))) {
      return await this.paymentMethodRepo.find({
        where: [
          { id: Number(searchInput), archived: getArchive },
          { coc: Number(searchInput), archived: getArchive },
        ],
        take: 20,
      });
    } else {
      return await this.paymentMethodRepo.find({
        where: {
          name: ILike(`%${searchInput}%`),
        },
        take: 20,
      });
    }
  }

  async create(data: CreatePaymentMethodDto) {
    const newPaymentMethod = this.paymentMethodRepo.create(data);
    return await this.paymentMethodRepo.save(newPaymentMethod);
  }

  async update(id: number, changes: UpdatePaymentMethodDto) {
    const paymentMethod = await this.findOne(id);
    this.paymentMethodRepo.merge(paymentMethod, changes);
    return await this.paymentMethodRepo.save(paymentMethod);
  }

  async archive(id: number) {
    const paymentMethod = await this.findOne(id);
    paymentMethod.archived = !paymentMethod.archived;
    return await this.paymentMethodRepo.save(paymentMethod);
  }
}
