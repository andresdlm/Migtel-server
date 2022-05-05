import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServicePlansController } from './controllers/service-plans.controller';
import { ServicePlansService } from './services/service-plans.service';
import { ServicePlan } from './entities/service-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePlan])],
  controllers: [ServicePlansController],
  providers: [ServicePlansService],
  exports: [ServicePlansService],
})
export class ServicePlansModule {}
