import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AppKeyService } from '../services/app-key.service';
import { CreateAppKeyDto } from '../dtos/app-key.dtos';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('app-key')
export class AppKeyController {
  constructor(private appKeyService: AppKeyService) {}

  @Roles(Role.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.appKeyService.findAll();
  }

  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() payload: CreateAppKeyDto) {
    return this.appKeyService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appKeyService.delete(id);
  }
}
