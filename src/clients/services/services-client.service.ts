import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateServiceClientDto,
  UpdateServiceClientDto,
} from '../dtos/service-clients.dtos';
import { ServicesClient } from '../entities/service-client.entity';

@Injectable()
export class ServicesClientService {
  constructor(
    @InjectRepository(ServicesClient)
    private servicesClientRepo: Repository<ServicesClient>,
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

  create(data: CreateServiceClientDto) {
    const newServiceClient = this.servicesClientRepo.create(data);
    return this.servicesClientRepo.save(newServiceClient);
  }

  async update(id: number, changes: UpdateServiceClientDto) {
    const serviceClient = await this.servicesClientRepo.findOne(id);
    this.servicesClientRepo.merge(serviceClient, changes);
    return this.servicesClientRepo.save(serviceClient);
  }

  delete(id: number) {
    return this.servicesClientRepo.delete(id);
  }
}
