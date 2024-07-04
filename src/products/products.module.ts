import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { Product } from './entities/product.entity';
import { ServicePlansController } from './controllers/service-plans.controller';
import { ServicePlansService } from './services/service-plans.service';
import { ServicePlan } from './entities/service-plan.entity';
import { InvoiceProductRelation } from 'src/invoices/entities/invoice-product-relation.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ServicePlan, InvoiceProductRelation]),
    LoggerModule,
  ],
  controllers: [ProductsController, ServicePlansController],
  providers: [ServicePlansService, ProductsService],
  exports: [ServicePlansService, ProductsService],
})
export class ProductsModule {}
