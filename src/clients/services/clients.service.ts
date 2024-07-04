import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';

import { CreateClientDto, FilterClientDto } from '../dtos/client.dtos';
import { Client } from '../entities/client.entity';
import config from 'src/config';
import { Observable, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as https from 'https';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(Client) private clientRepo: Repository<Client>,
    private httpService: HttpService,
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
      return this.clientRepo.create({ id: id, retention: 0, amountIslr: 0 });
    }
    return client;
  }

  searchCRMClients(query: string): Observable<AxiosResponse<any>> {
    const url = new URL(
      `clients?query=${query}&limit=10`,
      this.configService.crmUrl,
    );
    const headers = { 'X-Auth-App-Key': this.configService.crmApikey };
    const axiosConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };
    return this.httpService
      .get(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  getCRMClientsServices(clientId: string): Observable<AxiosResponse<any>> {
    const url = new URL(
      `clients/services?clientId=${clientId}`,
      this.configService.crmUrl,
    );
    const headers = { 'X-Auth-App-Key': this.configService.crmApikey };
    const axiosConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };
    return this.httpService
      .get(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  getCrmClient(id: number): Observable<any> {
    const url = new URL(`clients/${id}`, this.configService.crmUrl);
    const headers = { 'X-Auth-App-Key': this.configService.crmApikey };
    const axiosConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };
    return this.httpService
      .get(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  async createOrUpdate(data: CreateClientDto) {
    const client = await this.clientRepo.findOne({
      where: {
        id: data.id,
      },
    });
    if (client) {
      const client = await this.findOne(data.id);
      this.clientRepo.merge(client, data);
      return await this.clientRepo.save(client);
    } else {
      const newClient = this.clientRepo.create(data);
      return await this.clientRepo.save(newClient);
    }
  }

  async delete(id: number) {
    return await this.clientRepo.delete(id);
  }
}
