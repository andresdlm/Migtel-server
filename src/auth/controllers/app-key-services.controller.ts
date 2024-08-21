import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientsService } from 'src/clients/services/clients.service';
import { CurrencyRateService } from 'src/currency-rate/services/currency-rate.service';

import { InvoicesService } from 'src/invoices/services/invoices.service';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { AppKeyGuard } from '../guards/app-key.guard';
import { CreateInvoiceDto } from 'src/invoices/dtos/invoice.dtos';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../models/roles.model';
import { LogInterceptor } from 'src/logger/interceptors/log.interceptor';

@UseGuards(ApiKeyGuard, AppKeyGuard)
@Controller('app-key-services')
export class AppKeyServicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly clientsService: ClientsService,
    private readonly currencyRateService: CurrencyRateService,
  ) {}

  @Get('clients/:id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Get('crm/clients')
  getOneCrmClientByEmail(@Query('email') email: string) {
    return this.clientsService.getCrmClientByEmail(email);
  }

  @Get('crm/clients/:id')
  getOneCrmClientById(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.getCrmClient(id);
  }

  @Get('currency-rate/usd')
  async getLatestUSDRate() {
    return this.currencyRateService.getLatestUsdRate();
  }

  @UseInterceptors(LogInterceptor)
  @Post('invoices/createInvoice')
  create(@Body() payload: CreateInvoiceDto) {
    return this.invoicesService.create(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('invoices/previewInvoice')
  getPreview(@Body() payload: CreateInvoiceDto) {
    return this.invoicesService.getPreview(payload);
  }
}
