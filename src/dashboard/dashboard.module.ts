import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './controllers/dashboard.controller';
import { DailyIncomeView } from './entities/dailyIncomeView.entity';
import { MonthlyAccountIncomeView } from './entities/monthlyAccountIncomeView.entity';
import { MonthlyIncomeView } from './entities/monthlyIncomeView.entity';
import { CurrencyRateModule } from 'src/currency-rate/currency-rate.module';
import { OrganizationMonthlyView } from './entities/organizationMonthlyView.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyIncomeView,
      MonthlyAccountIncomeView,
      MonthlyIncomeView,
      OrganizationMonthlyView,
    ]),
    CurrencyRateModule,
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
