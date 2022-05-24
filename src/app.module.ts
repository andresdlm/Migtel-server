import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DatabaseModule } from './database/database.module';
import { ServicePlansModule } from './service-plans/service-plans.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { AuthModule } from './auth/auth.module';
import config from './../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_NAME: Joi.string().required(),
        HOST: Joi.string().required(),
        USER: Joi.string().required(),
        PASSWORD: Joi.string().required(),
        PORT: Joi.number().required(),
        API_KEY: Joi.string().required(),
      }),
    }),
    UsersModule,
    ClientsModule,
    InvoicesModule,
    DatabaseModule,
    ServicePlansModule,
    PaymentMethodsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
