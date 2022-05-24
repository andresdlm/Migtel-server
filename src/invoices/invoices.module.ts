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

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Invoice]),
    ClientsModule,
    ServicePlansModule,
    PaymentMethodsModule,
  ],
  controllers: [InvoicesController],
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
  ],
})
export class InvoicesModule {}
