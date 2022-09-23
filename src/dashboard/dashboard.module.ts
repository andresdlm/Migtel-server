import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './controllers/dashboard.controller';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Client } from 'src/clients/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Client])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
