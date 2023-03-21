import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateClientDto,
  UpdateClientDto,
  FilterClientDto,
} from '../dtos/client.dtos';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  findAll(params?: FilterClientDto) {
    if (params) {
      const { limit, offset } = params;
      return this.clientRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
      });
    }
    return this.clientRepo.find({
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    const client = this.clientRepo.findOne({
      where: {
        id: id,
      },
    });
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
    const client = await this.findOne(id);
    this.clientRepo.merge(client, changes);
    return this.clientRepo.save(client);
  }

  delete(id: number) {
    return this.clientRepo.delete(id);
  }
}
