import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerService } from './services/logger.service';
import { LoggerController } from './controllers/logger.controller';
import { Log } from './entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LoggerService],
  controllers: [LoggerController],
  exports: [LoggerService],
})
export class LoggerModule {}
