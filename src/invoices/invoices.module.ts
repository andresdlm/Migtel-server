import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule, HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { Invoice } from './entities/invoice.entity';

import { ClientsModule } from 'src/clients/clients.module';
import { ServicePlansModule } from 'src/service-plans/service-plans.module';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';
import { InvoiceConceptsController } from './controllers/invoice-concepts.controller';
import { InvoiceConceptsService } from './services/invoice-concepts.service';
import { InvoiceConcept } from './entities/invoice-concept.entity';
import { InvoiceConceptRelation } from './entities/invoice-concept-relation.entity';
import { InvoiceServices } from './entities/invoice-service-relation.entity';
import { InvoiceServicesService } from './services/invoice-services.service';
import { InvoicesService as InvoiceService } from './services/invoices.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceConcept,
      InvoiceConceptRelation,
      InvoiceServices,
    ]),
    ClientsModule,
    ServicePlansModule,
    PaymentMethodsModule,
    UsersModule,
  ],
  exports: [InvoiceService],
  controllers: [InvoicesController, InvoiceConceptsController],
  providers: [
    InvoicesService,
    {
      provide: 'DOLAR_API',
      useFactory: async (http: HttpService) => {
        const dolarToday = await lastValueFrom(
          http.get('https://s3.amazonaws.com/dolartoday/data.json'),
        );
        return dolarToday.data;
      },
      inject: [HttpService],
    },
    InvoiceConceptsService,
    InvoiceServicesService,
  ],
})
export class InvoicesModule {}
