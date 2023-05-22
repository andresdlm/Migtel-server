import { Module } from '@nestjs/common';

import { PaymentsController } from '../payments/controllers/payments.controller';
import { PaymentsService } from '../payments/services/payments.service';
import { Payment } from '../payments/entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Payment]),
    PaymentMethodsModule,
  ],
  exports: [PaymentsService],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
