import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/employees/services/users.service';
import { User } from 'src/employees/entities/user.entity';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      if (user.isLocked) {
        throw new ForbiddenException(
          'Account locked. Please contact technical support.',
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Reset failed attempts on successful login
        await this.usersService.resetFailedAttempts(user.id);
        return user;
      } else {
        // Increment failed attempts
        await this.usersService.incrementFailedAttempts(user.id);
        if (user.failedLoginAttempts + 1 >= 3) {
          await this.usersService.lockUser(user.id);
          throw new ForbiddenException(
            'Account locked. Please contact technical support.',
          );
        }
        throw new UnauthorizedException('Invalid credentials.');
      }
    }
    throw new UnauthorizedException('Invalid credentials.');
  }

  generateJWT(user: User) {
    const payload: PayloadToken = { role: user.role, userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
