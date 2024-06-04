import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import * as https from 'https';

import {
  MassByTagDTO,
  MassEmailDTO,
  MassSMSDTO,
  PaymentRecievedSMSDTO,
  SingleEmailDTO,
  SingleSMSDTO,
} from '../dtos/notify.dtos';
import config from 'src/config';
import { FilterByTags } from '../dtos/filter.dtos';

@Injectable()
export class NotifyService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private httpService: HttpService,
  ) {}

  singleSMS(body: SingleSMSDTO): Observable<AxiosResponse<any>> {
    const url = new URL(`/tedexis/front/single`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .post(url.toString(), body, axiosConfig)
      .pipe(map((res) => res.data));
  }

  massSMS(body: MassSMSDTO): Observable<AxiosResponse<any>> {
    const url = new URL(`/tedexis/front/mass`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .post(url.toString(), body, axiosConfig)
      .pipe(map((res) => res.data));
  }

  paymentRecievedSMS(
    body: PaymentRecievedSMSDTO,
  ): Observable<AxiosResponse<any>> {
    const url = new URL(
      '/tedexis/payment-received',
      this.configService.notifyUrl,
    );
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .post(url.toString(), body, axiosConfig)
      .pipe(map((res) => res.data));
  }

  getClientTags(): Observable<AxiosResponse<any>> {
    const url = new URL(`client-tags`, this.configService.crmUrl);
    const headers = { 'X-Auth-App-Key': this.configService.crmApikey };
    const axiosConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };
    return this.httpService
      .get(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  massByTagSMS(body: MassByTagDTO) {
    const url = new URL(
      `/tedexis/front/mass-by-filters`,
      this.configService.notifyUrl,
    );
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .post(url.toString(), body, axiosConfig)
      .pipe(map((res) => res.data));
  }

  getFilteredClients(body: FilterByTags) {
    const url = new URL(
      `/tedexis/front/filtered-clients`,
      this.configService.notifyUrl,
    );
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .post(url.toString(), body, axiosConfig)
      .pipe(map((res) => res.data));
  }

  singleEmail(body: SingleEmailDTO): Observable<AxiosResponse<any>> {
    const url = new URL(`/smtp/single`, this.configService.notifyUrl);
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .post(url.toString(), body, axiosConfig)
      .pipe(map((res) => res.data));
  }

  massEmail(body: MassEmailDTO) {
    const url = new URL(
      `/smtp/mass`,
      this.configService.notifyUrl,
    );
    const headers = {
      Authorization: `Bearer ${this.configService.notifyApikey}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .post(url.toString(), body, axiosConfig)
      .pipe(map((res) => res.data));
  }
}
