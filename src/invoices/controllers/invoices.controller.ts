import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../dtos/invoice.dtos';
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
  getAll() {
    return this.invoiceService.findAll();
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
  @Put(':invoiceNumber')
  update(
    @Param('invoiceNumber', ParseIntPipe) invoiceNumber: number,
    @Body() payload: UpdateInvoiceDto,
  ) {
    return this.invoiceService.update(invoiceNumber, payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':invoiceNumber')
  delete(@Param('invoiceNumber', ParseIntPipe) invoice_number: number) {
    return this.invoiceService.delete(invoice_number);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':invoiceNumber/client-service/:clientServiceId')
  deleteServiceFromInvoice(
    @Param('invoiceNumber', ParseIntPipe) invoiceNumber: number,
    @Param('clientServiceId', ParseIntPipe) clientServiceId: number,
  ) {
    return this.invoiceService.removeServiceByInvoice(
      invoiceNumber,
      clientServiceId,
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':invoiceNumber/client-service/:clientServiceId')
  addServiceToInvoice(
    @Param('invoiceNumber', ParseIntPipe) invoiceNumber: number,
    @Param('clientServiceId', ParseIntPipe) clientServiceId: number,
  ) {
    return this.invoiceService.addServiceToInvoice(
      invoiceNumber,
      clientServiceId,
    );
  }
}
