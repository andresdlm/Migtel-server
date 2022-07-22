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
      const { limit, offset, getArchive } = params;
      return this.clientRepo.find({
        relations: ['services'],
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { archived: getArchive },
      });
    }
    return this.clientRepo.find({
      relations: ['services'],
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    const client = this.clientRepo.findOne(id, {
      relations: ['services'],
    });
    if (!client) {
      throw new NotFoundException(`Client #${id} not found`);
    }
    return client;
  }

  searchClient(searchInput: string) {
    return this.clientRepo.query(
      `SELECT * FROM "clients" WHERE clients.archived = FALSE AND LOWER( clients.name )
      LIKE LOWER( '%${searchInput}%' )`,
    );
  }

  getCount(getArchive: boolean) {
    return this.clientRepo.count({
      where: { archived: getArchive },
    });
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

  async archive(id: number) {
    const client = await this.clientRepo.findOne(id);
    client.archived = !client.archived;
    return this.clientRepo.save(client);
  }

  delete(id: number) {
    return this.clientRepo.delete(id);
  }
}
