import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateInvoiceDto, FilterInvoiceDto } from '../dtos/invoice.dto';
import { InvoicesService } from '../services/invoices.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoiceService: InvoicesService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get()
  getAll(
    @Query() params: FilterInvoiceDto,
    @Query('getCanceled', ParseBoolPipe) getCanceled?: boolean,
  ) {
    if (params) params.getCanceled = getCanceled;
    return this.invoiceService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get(':invoiceNumber')
  getOne(@Param('invoiceNumber', ParseIntPipe) invoiceNumber: number) {
    return this.invoiceService.findOne(invoiceNumber);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get('client/:clientId')
  getByClientId(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.invoiceService.findByClientId(clientId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('')
  create(@Body() payload: CreateInvoiceDto) {
    return this.invoiceService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('preview')
  getPreview(@Body() payload: CreateInvoiceDto) {
    return this.invoiceService.getPreview(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':invoiceNumber')
  delete(@Param('invoiceNumber', ParseIntPipe) invoice_number: number) {
    return this.invoiceService.delete(invoice_number);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':invoiceNumber/cancelInvoice')
  cancelInvoice(@Param('invoiceNumber', ParseIntPipe) invoiceNumber: number) {
    return this.invoiceService.cancelInvoice(invoiceNumber);
  }
}
