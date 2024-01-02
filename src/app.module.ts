import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { EmployeesModule } from './employees/employees.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DatabaseModule } from './database/database.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { CurrencyRateModule } from './currency-rate/currency-rate.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DB_NAME: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        CRM_URL: Joi.string().required(),
        CRM_API_KEY: Joi.string().required(),
      }),
    }),
    EmployeesModule,
    ClientsModule,
    InvoicesModule,
    DatabaseModule,
    PaymentMethodsModule,
    AuthModule,
    ReportsModule,
    DashboardModule,
    ProductsModule,
    PaymentsModule,
    CurrencyRateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
