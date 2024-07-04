import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

import { LoggerService } from '../services/logger.service';
import { CreateLogDto } from '../dtos/log.dtos';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  private extractJwt(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }

  private createLogDto(request: Request, responseBody: any): CreateLogDto {
    return new CreateLogDto(
      request.path,
      request.method,
      JSON.stringify(request.body),
      JSON.stringify(responseBody),
      this.extractJwt(request),
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((responseBody) => {
        const logDto = this.createLogDto(request, responseBody);
        this.loggerService.log(
          `${logDto.httpMethod} to ${logDto.endpoint} processed successfully`,
          null,
          null,
          logDto,
        );
        return responseBody;
      }),
    );
  }
}
