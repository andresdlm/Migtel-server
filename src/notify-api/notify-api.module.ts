import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { NotifyController } from './controllers/notify.controller';
import { NotifyService } from './services/notify.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [HttpModule, LoggerModule],
  controllers: [NotifyController],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyApiModule {}
