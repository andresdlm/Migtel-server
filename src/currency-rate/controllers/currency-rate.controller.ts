import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrencyRateService } from '../services/currency-rate.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';

@UseGuards(ApiKeyGuard, JwtAuthGuard)
@Controller('currency-rate')
export class CurrencyRateController {
  constructor(private currencyRateService: CurrencyRateService) {}

  @Get('usd')
  async getLatestUSDRate() {
    return this.currencyRateService.getLatestUsdRate();
  }
}
