import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { ReportsLogicService } from './services/reports-logic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsLogicService],
})
export class ReportsModule {}
