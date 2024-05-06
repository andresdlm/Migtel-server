import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { CsvReportsController } from './controllers/csv-reports.controller';
import { CsvReportsService } from './services/csv-reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, PaymentMethod, Payment]),
    HttpModule,
  ],
  controllers: [ReportsController, CsvReportsController],
  providers: [ReportsService, CsvReportsService],
})
export class ReportsModule {}
