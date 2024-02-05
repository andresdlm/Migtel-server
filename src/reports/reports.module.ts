import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, PaymentMethod, Payment]), HttpModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
