import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DailyIncomeView } from '../entities/dailyIncomeView.entity';
import { MonthlyAccountIncomeView } from '../entities/monthlyAccountIncomeView.entity';
import { MonthlyIncomeView } from '../entities/monthlyIncomeView.entity';
import { CurrencyRateService } from '../../currency-rate/services/currency-rate.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DailyIncomeView)
    private dailyIncomeViewRepo: Repository<DailyIncomeView>,
    @InjectRepository(MonthlyAccountIncomeView)
    private monthlyAccountIncomeViewRepo: Repository<MonthlyAccountIncomeView>,
    @InjectRepository(MonthlyIncomeView)
    private monthlyIncomeViewRepo: Repository<MonthlyIncomeView>,
    private currencyRateService: CurrencyRateService,
  ) {}

  async generateDashboard() {
    const [dailyIncome] = await this.dailyIncomeViewRepo.find();
    const monthlyIncome = await this.monthlyIncomeViewRepo.find();
    const monthlyAccountIncome = await this.monthlyAccountIncomeViewRepo.find();
    const currencyRate = await this.currencyRateService.getLatestUsdRate();

    return {
      invoiceDailyIncome: dailyIncome.invoiceDailyIncome,
      paymentDailyIncome: dailyIncome.paymentDailyIncome,
      currencyRate: currencyRate.price,
      monthlyStats: monthlyIncome,
      accountsBalance: monthlyAccountIncome,
    };
  }
}
