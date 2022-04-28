import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateClientDto, UpdateClientDto } from '../dtos/clients.dtos';
import { Clients } from '../entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients) private clientRepo: Repository<Clients>,
  ) {}

  findAll() {
    return this.clientRepo.find();
  }

  findOne(id: number) {
    const client = this.clientRepo.findOne(id);
    if (!client) {
      throw new NotFoundException(`Client #${id} not found`);
    }
    return client;
  }

  create(data: CreateClientDto) {
    const newClient = this.clientRepo.create(data);
    return this.clientRepo.save(newClient);
  }

  async update(id: number, changes: UpdateClientDto) {
    const client = await this.clientRepo.findOne(id);
    this.clientRepo.merge(client, changes);
    return this.clientRepo.save(client);
  }

  delete(id: number) {
    return this.clientRepo.delete(id);
  }
}
