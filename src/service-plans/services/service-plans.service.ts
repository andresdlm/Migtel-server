import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNumber } from 'class-validator';
import { getRepository, Repository, Raw } from 'typeorm';

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

  findOne(id: number) {
    const servicePlan = this.servicePlanRepo.findOne(id);
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
          { id: searchInput, archived: getArchive },
          { price: searchInput, archived: getArchive },
        ],
      });
    } else {
      return await getRepository(ServicePlan).find({
        where: [
          {
            ['name']: Raw(
              (name) => `LOWER(${name}) Like '%${searchInput.toLowerCase()}%'`,
            ),
            archived: getArchive,
          },
          {
            ['invoiceLabel']: Raw(
              (invoiceLabel) =>
                `LOWER(${invoiceLabel}) Like '%${searchInput.toLowerCase()}%'`,
            ),
            archived: getArchive,
          },
          {
            ['servicePlanType']: Raw(
              (servicePlanType) =>
                `LOWER(${servicePlanType}) Like '%${searchInput.toLowerCase()}%'`,
            ),
            archived: getArchive,
          },
        ],
      });
    }
  }

  create(data: CreateServicePlanDto) {
    const newServicePlan = this.servicePlanRepo.create(data);
    return this.servicePlanRepo.save(newServicePlan);
  }

  async update(id: number, changes: UpdateServicePlanDto) {
    const servicePlan = await this.servicePlanRepo.findOne(id);
    this.servicePlanRepo.merge(servicePlan, changes);
    return this.servicePlanRepo.save(servicePlan);
  }

  async archive(id: number) {
    const servicePlan = await this.servicePlanRepo.findOne(id);
    servicePlan.archived = !servicePlan.archived;
    return this.servicePlanRepo.save(servicePlan);
  }

  delete(id: number) {
    return this.servicePlanRepo.delete(id);
  }
}
