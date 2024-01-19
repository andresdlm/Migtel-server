import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from 'src/clients/services/clients.service';
import { CurrencyRateService } from 'src/currency-rate/services/currency-rate.service';

import { InvoicesService } from 'src/invoices/services/invoices.service';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { AppKeyGuard } from '../guards/app-key.guard';
import { CreateInvoiceDto } from 'src/invoices/dtos/invoice.dtos';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../models/roles.model';

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

  @Get('currency-rate/usd')
  async getLatestUSDRate() {
    return this.currencyRateService.getLatestUsdRate();
  }

  @Post('invoices/createInvoice')
  create(@Body() payload: CreateInvoiceDto) {
    return this.invoicesService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('invoices/previewInvoice')
  getPreview(@Body() payload: CreateInvoiceDto) {
    return this.invoicesService.getPreview(payload);
  }
}
