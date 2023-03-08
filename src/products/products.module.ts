import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { Product } from './entities/product.entity';
import { ServicePlansController } from './controllers/service-plans.controller';
import { ServicePlansService } from './services/service-plans.service';
import { ServicePlan } from './entities/service-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ServicePlan])],
  controllers: [ProductsController, ServicePlansController],
  providers: [ServicePlansService, ProductsService],
  exports: [ServicePlansService, ProductsService],
})
export class ProductsModule {}
