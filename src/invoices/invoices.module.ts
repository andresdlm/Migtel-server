import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { Invoices } from './entities/invoice.entity';
import { ConceptsInvoiceController } from './controllers/concepts-invoice.controller';
import { ConceptsInvoiceService } from './services/concepts-invoice.service';
import { ConceptsInvoice } from './entities/concepts-invoice.entity';

import { ClientsModule } from 'src/clients/clients.module';

@Module({
  controllers: [InvoicesController, ConceptsInvoiceController],
  providers: [InvoicesService, ConceptsInvoiceService],
  imports: [
    TypeOrmModule.forFeature([Invoices, ConceptsInvoice]),
    ClientsModule,
  ],
})
export class InvoicesModule {}
