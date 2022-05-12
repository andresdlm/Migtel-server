import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { Invoice } from './entities/invoice.entity';

import { ClientsModule } from 'src/clients/clients.module';
import { ServicePlansModule } from 'src/service-plans/service-plans.module';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    ClientsModule,
    ServicePlansModule,
    PaymentMethodsModule,
  ],
})
export class InvoicesModule {}
