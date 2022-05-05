import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateServicePlanDto,
  UpdateServicePlanDto,
} from '../dtos/service-plan.dtos';
import { ServicePlan } from '../entities/service-plan.entity';

@Injectable()
export class ServicePlansService {
  constructor(
    @InjectRepository(ServicePlan)
    private servicePlanRepo: Repository<ServicePlan>,
  ) {}

  findAll() {
    return this.servicePlanRepo.find();
  }

  findOne(id: number) {
    const servicePlan = this.servicePlanRepo.findOne(id);
    if (!servicePlan) {
      throw new NotFoundException(`Service Plan #${id} not found`);
    }
    return servicePlan;
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

  delete(id: number) {
    return this.servicePlanRepo.delete(id);
  }
}
