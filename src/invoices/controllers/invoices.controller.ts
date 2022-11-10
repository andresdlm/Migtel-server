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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get()
  getAll(
    @Query() params: FilterInvoiceDto,
    @Query('getCanceled', ParseBoolPipe) getCanceled?: boolean,
  ) {
    if (params) params.getCanceled = getCanceled;
    return this.invoiceService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('unprinted')
  getUnprinted(@Query() params: FilterInvoiceDto) {
    return this.invoiceService.getUnprinted(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('unprinted-count')
  getUnprintedCount() {
    return this.invoiceService.getUnprintedCount();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('count')
  getCount(@Query('getCanceled', ParseBoolPipe) getCanceled: boolean) {
    return this.invoiceService.getCount(getCanceled);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('search')
  search(
    @Query('searchParam') searchParam: string,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    return this.invoiceService.search(searchParam, getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('printInvoice/:count')
  printInvoice(@Param('count', ParseIntPipe) count: number) {
    return this.invoiceService.printCount(count);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get(':invoiceNumber')
  getOne(@Param('invoiceNumber', ParseIntPipe) invoiceNumber: number) {
    return this.invoiceService.findOne(invoiceNumber);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('client/:clientId')
  getByClientId(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Query() params: FilterInvoiceDto,
    @Query('getCanceled', ParseBoolPipe) getCanceled?: boolean,
  ) {
    if (params) params.getCanceled = getCanceled;
    return this.invoiceService.findByClientId(clientId, params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('')
  create(@Body() payload: CreateInvoiceDto) {
    return this.invoiceService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':invoiceNumber/unprintInvoice')
  unprintInvoice(@Param('invoiceNumber', ParseIntPipe) invoiceNumber: number) {
    return this.invoiceService.unprint(invoiceNumber);
  }
}
