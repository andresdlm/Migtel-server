import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { Invoice } from './entities/invoice.entity';
import { InvoiceConceptsController } from './controllers/invoice-concepts.controller';
import { InvoiceConceptsService } from './services/invoice-concepts.service';
import { InvoiceConcept } from './entities/invoice-concept.entity';

import { ClientsModule } from 'src/clients/clients.module';

@Module({
  controllers: [InvoicesController, InvoiceConceptsController],
  providers: [InvoicesService, InvoiceConceptsService],
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceConcept]), ClientsModule],
})
export class InvoicesModule {}
