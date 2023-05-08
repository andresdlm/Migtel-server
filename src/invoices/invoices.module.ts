import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { Invoice } from './entities/invoice.entity';

import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { Payment } from './entities/payment.entity';

import { ClientsModule } from 'src/clients/clients.module';
import { ProductsModule } from 'src/products/products.module';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';
import { InvoiceProductRelation } from './entities/invoice-product-relation.entity';
import { InvoiceServiceRelation } from './entities/invoice-service-relation.entity';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceProductRelation,
      InvoiceServiceRelation,
      Payment
    ]),
    ClientsModule,
    ProductsModule,
    PaymentMethodsModule,
    EmployeesModule,
  ],
  exports: [InvoicesService, PaymentsService],
  controllers: [InvoicesController, PaymentsController],
  providers: [InvoicesService, PaymentsService],
})
export class InvoicesModule {}
