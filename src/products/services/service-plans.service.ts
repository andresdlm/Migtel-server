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

  async findAll(params?: FilterServicePlanDto) {
    if (params) {
      const { limit, offset, getArchive } = params;
      return await this.servicePlanRepo.find({
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

  async findAllOrderByName(params?: FilterServicePlanDto) {
    if (params) {
      const { limit, offset, getArchive } = params;
      return await this.servicePlanRepo.find({
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

  async findOne(id: number) {
    const servicePlan = await this.servicePlanRepo.findOneBy({ id: id });
    if (!servicePlan) {
      throw new NotFoundException(`Service Plan #${id} not found`);
    }
    return servicePlan;
  }

  async getCount(getArchive: boolean) {
    return await this.servicePlanRepo.count({
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

  async create(data: CreateServicePlanDto) {
    const newServicePlan = this.servicePlanRepo.create(data);
    return await this.servicePlanRepo.save(newServicePlan);
  }

  async update(id: number, changes: UpdateServicePlanDto) {
    const servicePlan = await this.findOne(id);
    if (!servicePlan) {
      throw new NotFoundException(`Service plan #${id} not found`);
    }
    this.servicePlanRepo.merge(servicePlan, changes);
    return this.servicePlanRepo.save(servicePlan);
  }

  async archive(id: number) {
    const servicePlan = await this.findOne(id);
    if (!servicePlan) {
      throw new NotFoundException(`Service plan #${id} not found`);
    }
    servicePlan.archived = !servicePlan.archived;
    return this.servicePlanRepo.save(servicePlan);
  }

  async delete(id: number) {
    return await this.servicePlanRepo.delete(id);
  }
}
