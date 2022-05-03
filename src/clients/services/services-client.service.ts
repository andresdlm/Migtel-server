import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateServiceClientDto,
  UpdateServiceClientDto,
} from '../dtos/service-clients.dtos';
import { ServicesClient } from '../entities/service-client.entity';
import { ClientsService } from './clients.service';
import { ServicePlansService } from 'src/service-plans/services/service-plans.service';

@Injectable()
export class ServicesClientService {
  constructor(
    @InjectRepository(ServicesClient)
    private servicesClientRepo: Repository<ServicesClient>,
    private clientsService: ClientsService,
    private servicePlansService: ServicePlansService,
  ) {}

  findAll() {
    return this.servicesClientRepo.find();
  }

  findOne(id: number) {
    const serviceClient = this.servicesClientRepo.findOne(id);
    if (!serviceClient) {
      throw new NotFoundException(`Service Client #${id} not found`);
    }
    return serviceClient;
  }

  async create(data: CreateServiceClientDto) {
    const newServiceClient = this.servicesClientRepo.create(data);
    if (data.clientId) {
      const client = await this.clientsService.findOne(data.clientId);
      newServiceClient.client = client;
    }
    if (data.servicePlanId) {
      const servicePlan = await this.servicePlansService.findOne(
        data.servicePlanId,
      );
      newServiceClient.servicePlan = servicePlan;
    }
    return this.servicesClientRepo.save(newServiceClient);
  }

  async update(id: number, changes: UpdateServiceClientDto) {
    const serviceClient = await this.servicesClientRepo.findOne(id);
    if (changes.clientId) {
      const client = await this.clientsService.findOne(changes.clientId);
      serviceClient.client = client;
    }
    if (changes.servicePlanId) {
      const servicePlan = await this.servicePlansService.findOne(
        changes.servicePlanId,
      );
      serviceClient.servicePlan = servicePlan;
    }
    this.servicesClientRepo.merge(serviceClient, changes);
    return this.servicesClientRepo.save(serviceClient);
  }

  delete(id: number) {
    return this.servicesClientRepo.delete(id);
  }
}
