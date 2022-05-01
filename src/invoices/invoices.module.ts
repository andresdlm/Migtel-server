import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { Invoices } from './entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoices])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
