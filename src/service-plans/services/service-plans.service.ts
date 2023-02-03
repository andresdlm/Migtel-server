import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNumber } from 'class-validator';
import { Repository, ILike } from 'typeorm';

import {
  CreateServicePlanDto,
  FilterServicePlanDto,
  UpdateServicePlanDto,
} from '../dtos/service-plan.dtos';
import { ServicePlan } from '../entities/service-plan.entity';

@Injectable()
export class ServicePlansService {
  constructor(
    @InjectRepository(ServicePlan)
    private servicePlanRepo: Repository<ServicePlan>,
  ) {}

  findAll(params?: FilterServicePlanDto) {
    if (params) {
      const { limit, offset, getArchive } = params;
      return this.servicePlanRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { archived: getArchive },
      });
    }
    return this.servicePlanRepo.find({
      order: { id: 'DESC' },
    });
  }

  findAllOrderByName(params?: FilterServicePlanDto) {
    if (params) {
      const { limit, offset, getArchive } = params;
      return this.servicePlanRepo.find({
        order: { name: 'ASC' },
        take: limit,
        skip: offset,
        where: { archived: getArchive },
      });
    }
    return this.servicePlanRepo.find({
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    const servicePlan = this.servicePlanRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!servicePlan) {
      throw new NotFoundException(`Service Plan #${id} not found`);
    }
    return servicePlan;
  }

  getCount(getArchive: boolean) {
    return this.servicePlanRepo.count({
      where: { archived: getArchive },
    });
  }

  async search(searchInput: string, getArchive: boolean) {
    if (isNumber(Number(searchInput))) {
      return this.servicePlanRepo.find({
        where: [
          { id: Number(searchInput), archived: getArchive },
          { price: Number(searchInput), archived: getArchive },
        ],
        take: 20,
      });
    } else {
      return this.servicePlanRepo.find({
        where: [
          {
            name: ILike(`%${searchInput}%`),
            archived: getArchive,
          },
          {
            invoiceLabel: ILike(`%${searchInput}%`),
            archived: getArchive,
          },
          {
            servicePlanType: ILike(`%${searchInput}%`),
            archived: getArchive,
          },
        ],
        take: 20,
      });
    }
  }

  create(data: CreateServicePlanDto) {
    const newServicePlan = this.servicePlanRepo.create(data);
    return this.servicePlanRepo.save(newServicePlan);
  }

  async update(id: number, changes: UpdateServicePlanDto) {
    const servicePlan = await this.findOne(id);
    this.servicePlanRepo.merge(servicePlan, changes);
    return this.servicePlanRepo.save(servicePlan);
  }

  async archive(id: number) {
    const servicePlan = await this.findOne(id);
    servicePlan.archived = !servicePlan.archived;
    return this.servicePlanRepo.save(servicePlan);
  }

  delete(id: number) {
    return this.servicePlanRepo.delete(id);
  }
}
