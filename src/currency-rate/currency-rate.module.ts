import { Module } from '@nestjs/common';
import { CurrencyRateController } from './controllers/currency-rate.controller';
import { CurrencyRateService } from './services/currency-rate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyRate } from './entities/currency-rate.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate]), ScheduleModule.forRoot()],
  exports: [CurrencyRateService],
  controllers: [CurrencyRateController],
  providers: [CurrencyRateService],
})
export class CurrencyRateModule {}
