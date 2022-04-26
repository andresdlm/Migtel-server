import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Client } from 'pg';
import { CreateClientDto, UpdateClientDto } from './../dtos/clients.dtos';

@Injectable()
export class ClientsService {
  constructor(@Inject('PG') private dbClient: Client) {}

  findAll() {
    return null;
  }

  findOne(id: number) {
    const client = null;
    if (!client) {
      throw new NotFoundException(`Client #${id} not found`);
    }
    return client;
  }

  create(payload: CreateClientDto) {
    return null;
  }

  update(id: number, payload: UpdateClientDto) {
    const client = this.findOne(id);
    if (client) {
      return null;
    }
    return null;
  }

  remove(id: number) {
    return null;
  }
}
