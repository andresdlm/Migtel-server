import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import * as https from 'https';

import { MassSMSDTO, SingleSMSDTO } from '../dtos/notify.dtos';
import config from 'src/config';

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
}
