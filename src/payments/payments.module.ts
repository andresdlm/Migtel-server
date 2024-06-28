import { Module } from '@nestjs/common';

import { PaymentsController } from '../payments/controllers/payments.controller';
import { PaymentsService } from '../payments/services/payments.service';
import { Payment } from '../payments/entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Payment]),
    PaymentMethodsModule,
    LoggerModule,
  ],
  exports: [PaymentsService],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
