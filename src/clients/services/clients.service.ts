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

  async findAll(params?: FilterClientDto) {
    if (params) {
      const { limit, offset } = params;
      return await this.clientRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
      });
    }
    return await this.clientRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const client = await this.clientRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!client) {
      throw new NotFoundException(`Client #${id} not found`);
    }
    return client;
  }

  async create(data: CreateClientDto) {
    const newClient = this.clientRepo.create(data);
    return await this.clientRepo.save(newClient);
  }

  async update(id: number, changes: UpdateClientDto) {
    const client = await this.clientRepo.findOneBy({ id: id });
    if (!client) {
      throw new NotFoundException(`Client #${id} not found`);
    }
    this.clientRepo.merge(client, changes);
    return await this.clientRepo.save(client);
  }

  async delete(id: number) {
    return await this.clientRepo.delete(id);
  }
}
