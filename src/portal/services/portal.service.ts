import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import * as https from 'https';
import { map } from 'rxjs';
import config from 'src/config';
import { UpdateState } from '../dtos/portal.dtos';

@Injectable()
export class PortalService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly httpService: HttpService,
  ) {}

  getPaymentMethods() {
    const url = new URL(
      `payment-methods`,
      this.configService.portalUrl,
    );
    const headers = {
      Auth: `${this.configService.apiKeyPortal}`,
    };
    const axiosConfig: AxiosRequestConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    return this.httpService
      .get(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  updatePaymentMethodState(id: number, body: UpdateState) {
    const url = new URL(
      `payment-methods/active/${id}`,
      this.configService.portalUrl,
    );
    const headers = {
      Auth: `${this.configService.apiKeyPortal}`,
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
