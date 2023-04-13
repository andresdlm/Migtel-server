import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, PaymentMethod])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
