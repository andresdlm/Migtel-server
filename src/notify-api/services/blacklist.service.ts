import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import * as https from 'https';
import { map, Observable } from 'rxjs';

import config from 'src/config';
import { Blacklist, CreateBlacklistDto, UpdateBlacklistDto } from '../dtos/blacklist.dtos';

@Injectable()
export class BlacklistService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private httpService: HttpService,
  ) {}

  public add(body: CreateBlacklistDto): Observable<Blacklist> {
    const url = new URL(`/blacklist`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .post<Blacklist>(url.toString(), body, axiosConfig)
      .pipe(map((res) => res.data));
  }

  public getAll(): Observable<Blacklist[]> {
    const url = new URL(`/blacklist`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .get<Blacklist[]>(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  public getOne(id: number): Observable<Blacklist> {
    const url = new URL(`/blacklist/${id}`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .get<Blacklist>(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  public update(id: number, body: UpdateBlacklistDto): Observable<Blacklist> {
    const url = new URL(`/blacklist/${id}`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .patch<Blacklist>(url.toString(), body, axiosConfig)
      .pipe(map((res) => res.data));
  }

  public softRemove(id: number): Observable<Blacklist> {
    const url = new URL(`/blacklist/${id}`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .delete<Blacklist>(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  public remove(id: number): Observable<Blacklist> {
    const url = new URL(`/blacklist/remove/${id}`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .delete<Blacklist>(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  public getAllDeleted(): Observable<Blacklist[]> {
    const url = new URL(`/blacklist/deleted`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .get<Blacklist[]>(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  public restore(id: number): Observable<Blacklist> {
    const url = new URL(`/blacklist/restore/${id}`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .post<Blacklist>(url.toString(), {}, axiosConfig)
      .pipe(map((res) => res.data));
  }
}
