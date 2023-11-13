import { Controller, Get } from '@nestjs/common';
import { CurrencyRateService } from '../services/currency-rate.service';

@Controller('currency-rate')
export class CurrencyRateController {
  constructor(private currencyRateService: CurrencyRateService) {}

  @Get('usd')
  async getLatestUSDRate() {
    return this.currencyRateService.getLatestUsdRate();
  }
}
