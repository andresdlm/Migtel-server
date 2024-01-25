import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DailyIncomeView } from '../entities/dailyIncomeView.entity';
import { MonthlyAccountIncomeView } from '../entities/monthlyAccountIncomeView.entity';
import { MonthlyIncomeView } from '../entities/monthlyIncomeView.entity';
import { MonthlySalesView } from '../entities/monthlySalesView.entity';
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
    @InjectRepository(MonthlySalesView)
    private monthlySalesViewRepo: Repository<MonthlySalesView>,
    private currencyRateService: CurrencyRateService,
  ) {}

  async generateDashboard() {
    const [dailyIncome] = await this.dailyIncomeViewRepo.find();
    const [monthlyIncome] = await this.monthlyIncomeViewRepo.find();
    const monthlySalesIncome = await this.monthlySalesViewRepo.find();
    const monthlyAccountIncome = await this.monthlyAccountIncomeViewRepo.find();
    const currencyRate = await this.currencyRateService.getLatestUsdRate();

    const dashboard = {
      dailyIncome: dailyIncome?.dailyIncome || 0,
      monthlyIncome: monthlyIncome?.monthlyIncome || 0,
      monthlyTaxes: monthlyIncome?.monthlyTaxes || 0,
      yearlyIncome: monthlySalesIncome.map((income) => income.monthlyTotal),
      currencyRate: currencyRate.price,
      accountsBalance: monthlyAccountIncome.map((income) => ({
        id: income.id,
        name: income.name,
        count: income.count,
        y: income.y,
      })),
    };

    return dashboard;
  }
}
