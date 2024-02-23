import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { NotifyController } from './controllers/notify.controller';
import { NotifyService } from './services/notify.service';

@Module({
  imports: [HttpModule],
  controllers: [NotifyController],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyApiModule {}
