import { Module } from '@nestjs/common';
import { PortalController } from './controllers/portal.controller';
import { PortalService } from './services/portal.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [HttpModule, LoggerModule],
  controllers: [PortalController],
  providers: [PortalService],
  exports: [PortalService],
})
export class PortalModule {}
