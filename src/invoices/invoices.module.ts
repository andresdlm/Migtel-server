import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { Invoices } from './entities/invoice.entity';
import { ConceptsInvoiceController } from './controllers/concepts-invoice/concepts-invoice.controller';
import { ConceptsInvoiceService } from './services/concepts-invoice/concepts-invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoices])],
  controllers: [InvoicesController, ConceptsInvoiceController],
  providers: [InvoicesService, ConceptsInvoiceService],
})
export class InvoicesModule {}
