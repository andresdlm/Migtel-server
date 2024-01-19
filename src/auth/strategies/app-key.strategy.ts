import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AppKeyService } from '../services/app-key.service';

@Injectable()
export class AppKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'app-key',
) {
  constructor(private appKeyService: AppKeyService) {
    super({ header: 'appKey', prefix: '' } as any, true, (apiKey, done) => {
      this.validate(apiKey, done);
    });
  }

  public validate = async (
    apiKey: string,
    done: (error: Error, data: any) => object,
  ) => {
    const checkKey = await this.appKeyService.validateAppKey(apiKey);
    if (checkKey) {
      done(null, true);
    }
    done(null, false);
  };
}
