import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeesModule } from 'src/employees/employees.module';
import { AppKey } from './entities/app-key.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppKeyService } from './services/app-key.service';
import { AppKeyController } from './controllers/app-key.controller';
import config from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppKey]),
    EmployeesModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 3000,
        limit: 2,
      },
    ]),
  ],
  providers: [AuthService, AppKeyService, LocalStrategy, JwtStrategy],
  controllers: [AuthController, AppKeyController],
})
export class AuthModule {}
