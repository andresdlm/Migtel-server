import {
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import * as https from 'https';

import config from 'src/config';
import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';
import { Payment } from '../entities/payment.entity';
import {
  CreateCRMPaymentDTO,
  CreatePaymentDto,
  FilterPaymentDto,
  UpdatePaymentDTO,
} from '../dtos/payment.dtos';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private paymentMethodService: PaymentMethodsService,
    private httpService: HttpService,
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

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
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

  async getCount() {
    return await this.paymentRepo.count();
  }

  async search(searchInput: string) {
    if (isNumber(Number(searchInput))) {
      return await this.paymentRepo.find({
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

    await this.createCrmPayment(data.paymentCrmDto);

    return await this.paymentRepo.save(newPayment);
  }

  async createCrmPayment(payload: CreateCRMPaymentDTO) {
    const url = new URL(`payments`, this.configService.crmUrl);
    const headers = { 'X-Auth-App-Key': this.configService.crmApikey };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    try {
      return await firstValueFrom(
        this.httpService.post(url.toString(), payload, axiosConfig),
      );
    } catch (error) {
      throw new ServiceUnavailableException('UISP unavailable');
    }
  }

  async update(id: number, changes: UpdatePaymentDTO) {
    const payment = await this.findOne(id);
    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }
    if (changes.paymentMethodId) {
      payment.paymentMethod = await this.paymentMethodService.findOne(
        changes.paymentMethodId,
      );
    }
    this.paymentRepo.merge(payment, changes);
    return await this.paymentRepo.save(payment);
  }

  async delete(id: number) {
    return this.paymentRepo.delete(id);
  }
}
