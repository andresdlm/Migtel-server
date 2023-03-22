import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { Invoice } from './entities/invoice.entity';

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
    ]),
    ClientsModule,
    ProductsModule,
    PaymentMethodsModule,
    EmployeesModule,
  ],
  exports: [InvoicesService],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
