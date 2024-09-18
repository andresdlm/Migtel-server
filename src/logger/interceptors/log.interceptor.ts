import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

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
    const response: Response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const logDto = this.createLogDto(request, responseBody);
          const message = `${logDto.httpMethod} to ${logDto.endpoint} processed successfully`;

          if (response.statusCode >= 200 && response.statusCode < 300) {
            this.loggerService.log(message, null, null, logDto);
          } else if (response.statusCode >= 400 && response.statusCode < 500) {
            this.loggerService.warn(message, null, null, logDto);
          } else {
            this.loggerService.error(message, null, null, logDto);
          }
        },
        error: (error) => {
          const logDto = this.createLogDto(request, error.response);
          const message = `${logDto.httpMethod} to ${logDto.endpoint} failed`;
          const stack = String(error.stack).slice(0, 500);

          if (error instanceof HttpException) {
            const status = error.getStatus();
            if (status >= 400 && status < 500) {
              this.loggerService.warn(message, stack, null, logDto);
            } else {
              this.loggerService.error(message, stack, null, logDto);
            }
          } else {
            this.loggerService.fatal(message, stack, null, logDto);
          }

          // Re-throw the error to be handled by NestJS exception filters
          return throwError(() => error);
        },
      }),
    );
  }
}
