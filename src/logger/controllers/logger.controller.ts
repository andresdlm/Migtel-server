import { Controller, UseGuards } from '@nestjs/common';

import { LoggerService } from '../services/logger.service';

@UseGuards()
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}
}
