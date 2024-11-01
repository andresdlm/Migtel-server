import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreatePaymentMethodDto,
  FilterPaymentMethodDto,
  UpdatePaymentMethodDto,
} from '../dtos/payment-method.dtos';
import { PaymentMethodsService } from '../services/payment-methods.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { LogInterceptor } from 'src/logger/interceptors/log.interceptor';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private paymentMethodService: PaymentMethodsService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get()
  getAll(
    @Query() params: FilterPaymentMethodDto,
    @Query('getArchive') getArchive: boolean = false,
  ) {
    params.getArchive = getArchive;
    return this.paymentMethodService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('count')
  getCount(@Query('getArchive', ParseBoolPipe) getArchive: boolean) {
    return this.paymentMethodService.getCount(getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('search')
  search(
    @Query('searchParam') searchParam: string,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    return this.paymentMethodService.search(searchParam, getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodService.findOne(id);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('')
  create(@Body() payload: CreatePaymentMethodDto) {
    return this.paymentMethodService.create(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodService.update(id, payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('archive/:id')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodService.archive(id);
  }
}
