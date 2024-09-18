import { Injectable, ConsoleLogger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../entities/log.entity';
import { CreateLogDto } from '../dtos/log.dtos';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(@InjectRepository(Log) private logRepo: Repository<Log>) {
    super();
  }

  log(message: any, stack?: string, context?: string, logDto?: CreateLogDto) {
    if (logDto) {
      super.log(message);
      const log = this.logRepo.create(logDto);
      log.message = message;
      log.severity = 'LOG';
      log.stack = stack;
      this.logRepo.save(log);
    } else {
      super.log(message, stack || context);
    }
  }

  fatal(message: any, stack?: string, context?: string, logDto?: CreateLogDto) {
    if (logDto) {
      super.fatal(message);
      const log = this.logRepo.create(logDto);
      log.message = message;
      log.severity = 'FATAL';
      log.stack = stack;
      this.logRepo.save(log);
    } else {
      super.fatal(message, stack || context);
    }
  }

  error(message: any, stack?: string, context?: string, logDto?: CreateLogDto) {
    if (logDto) {
      super.error(message);
      const log = this.logRepo.create(logDto);
      log.message = message;
      log.severity = 'ERROR';
      log.stack = stack;
      this.logRepo.save(log);
    } else {
      super.error(message, stack || context);
    }
  }

  warn(message: any, stack?: string, context?: string, logDto?: CreateLogDto) {
    if (logDto) {
      super.warn(message);
      const log = this.logRepo.create(logDto);
      log.message = message;
      log.severity = 'WARN';
      log.stack = stack;
      this.logRepo.save(log);
    } else {
      super.warn(message, stack || context);
    }
  }
}
