import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateClientServiceDto,
  UpdateClientServiceDto,
} from '../dtos/client-service.dtos';
import { ClientService } from '../entities/client-service.entity';
import { ClientsService } from './clients.service';
import { ServicePlansService } from 'src/service-plans/services/service-plans.service';

@Injectable()
export class ClientServicesService {
  constructor(
    @InjectRepository(ClientService)
    private clientServiceRepo: Repository<ClientService>,
    private clientsService: ClientsService,
    private servicePlanService: ServicePlansService,
  ) {}

  findAll() {
    return this.clientServiceRepo.find();
  }

  findOne(id: number) {
    const clientService = this.clientServiceRepo.findOne(id);
    if (!clientService) {
      throw new NotFoundException(`Service Client #${id} not found`);
    }
    return clientService;
  }

  async create(data: CreateClientServiceDto) {
    const newClientService = this.clientServiceRepo.create(data);
    if (data.clientId) {
      const client = await this.clientsService.findOne(data.clientId);
      newClientService.client = client;
    }
    if (data.servicePlanId) {
      const servicePlan = await this.servicePlanService.findOne(
        data.servicePlanId,
      );
      newClientService.servicePlan = servicePlan;
    }
    return this.clientServiceRepo.save(newClientService);
  }

  async update(id: number, changes: UpdateClientServiceDto) {
    const clientService = await this.clientServiceRepo.findOne(id);
    if (changes.clientId) {
      const client = await this.clientsService.findOne(changes.clientId);
      clientService.client = client;
    }
    if (changes.servicePlanId) {
      const servicePlan = await this.servicePlanService.findOne(
        changes.servicePlanId,
      );
      clientService.servicePlan = servicePlan;
    }
    this.clientServiceRepo.merge(clientService, changes);
    return this.clientServiceRepo.save(clientService);
  }

  delete(id: number) {
    return this.clientServiceRepo.delete(id);
  }
}
