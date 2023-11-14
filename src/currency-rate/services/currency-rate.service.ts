import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import * as request from 'request';
import { JSDOM } from 'jsdom';

import { CurrencyRate } from '../entities/currency-rate.entity';

@Injectable()
export class CurrencyRateService {
  constructor(
    @InjectRepository(CurrencyRate)
    private clientRepo: Repository<CurrencyRate>,
  ) {}

  private async getSoup(): Promise<JSDOM> {
    const url = 'https://www.bcv.org.ve/';
    return new Promise((resolve, reject) => {
      request.get(
        { url, rejectUnauthorized: false },
        (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(new JSDOM(body));
          }
        },
      );
    });
  }

  async getUsd(): Promise<number> {
    const dom = await this.getSoup();
    const document = dom.window.document;
    return parseFloat(
      document
        .getElementById('dolar')
        .textContent.trim()
        .replace(',', '.')
        .replace(' ', '')
        .replace('\n', '')
        .replace('USD', ''),
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM) // UTC-4:00 Caracas
  async handleCron() {
    const usdPrice = await this.getUsd();

    const currencyRate = new CurrencyRate();
    currencyRate.price = usdPrice;
    currencyRate.currency = 'USD';

    await this.clientRepo.save(currencyRate);
  }

  async getLatestUsdRate() {
    return await this.clientRepo.findOne({
      where: { currency: 'USD' },
      order: { consultedAt: 'DESC' },
    });
  }
}
