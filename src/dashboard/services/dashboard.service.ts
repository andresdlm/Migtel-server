import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DailyIncomeView } from '../entities/dailyIncomeView.entity';
import { MonthlyAccountIncomeView } from '../entities/monthlyAccountIncomeView.entity';
import { MonthlyIncomeView } from '../entities/monthlyIncomeView.entity';
import { CurrencyRateService } from '../../currency-rate/services/currency-rate.service';
import { OrganizationMonthlyView } from '../entities/organizationMonthlyView.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DailyIncomeView)
    private dailyIncomeViewRepo: Repository<DailyIncomeView>,
    @InjectRepository(MonthlyAccountIncomeView)
    private monthlyAccountIncomeViewRepo: Repository<MonthlyAccountIncomeView>,
    @InjectRepository(MonthlyIncomeView)
    private monthlyIncomeViewRepo: Repository<MonthlyIncomeView>,
    @InjectRepository(OrganizationMonthlyView)
    private organizationMonthlyViewRepo: Repository<OrganizationMonthlyView>,
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

  async organizationDashboard() {
    const organizationIncome = await this.organizationMonthlyViewRepo.find();

    const groupedData = organizationIncome.reduce((result, entry) => {
      const {
        organizationId,
        monthNumber,
        invoicesCount,
        invoicesIncome,
        taxes,
        paymentsCount,
        paymentsIncome,
        transactionsCount,
        totalIncome,
      } = entry;

      if (!result[organizationId]) {
        result[organizationId] = [];
        const currentMonth = new Date().getMonth() + 2;
        for (let i = 0; i < 12; i++) {
          const monthNumber = (currentMonth + i) % 12 || 12;
          result[organizationId].push({
            monthNumber,
            invoicesCount: 0,
            invoicesIncome: 0,
            taxes: 0,
            paymentsCount: 0,
            paymentsIncome: 0,
            transactionsCount: 0,
            totalIncome: 0,
          });
        }
      }

      const monthIndex = result[organizationId].findIndex((element) => {
        return element.monthNumber === monthNumber;
      });
      result[organizationId][monthIndex] = {
        monthNumber: monthNumber,
        invoicesCount: invoicesCount,
        invoicesIncome: invoicesIncome,
        taxes: taxes,
        paymentsCount: paymentsCount,
        paymentsIncome: paymentsIncome,
        transactionsCount: transactionsCount,
        totalIncome: totalIncome,
      };

      return result;
    }, {});
    return {
      organizationStats: groupedData,
    };
  }
}
