import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../dtos/invoice.dtos';
import { InvoicesService } from '../services/invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoiceService: InvoicesService) {}

  @Get()
  getAll() {
    return this.invoiceService.findAll();
  }

  @Get(':invoiceNumber')
  getOne(@Param('invoiceNumber', ParseIntPipe) invoiceNumber: number) {
    return this.invoiceService.findOne(invoiceNumber);
  }

  @Get('client/:clientId')
  getByClientId(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.invoiceService.findByClientId(clientId);
  }

  @Post('')
  create(@Body() payload: CreateInvoiceDto) {
    return this.invoiceService.create(payload);
  }

  @Put(':invoiceNumber')
  update(
    @Param('invoiceNumber', ParseIntPipe) invoiceNumber: number,
    @Body() payload: UpdateInvoiceDto,
  ) {
    return this.invoiceService.update(invoiceNumber, payload);
  }

  @Delete(':invoiceNumber')
  delete(@Param('invoiceNumber', ParseIntPipe) invoice_number: number) {
    return this.invoiceService.delete(invoice_number);
  }

  @Delete(':invoiceNumber/client-service/:clientServiceId')
  deleteCategory(
    @Param('invoiceNumber', ParseIntPipe) invoiceNumber: number,
    @Param('clientServiceId', ParseIntPipe) clientServiceId: number,
  ) {
    return this.invoiceService.removeServiceByInvoice(
      invoiceNumber,
      clientServiceId,
    );
  }

  @Put(':invoiceNumber/client-service/:clientServiceId')
  addCategoryToProduct(
    @Param('invoiceNumber', ParseIntPipe) invoiceNumber: number,
    @Param('clientServiceId', ParseIntPipe) clientServiceId: number,
  ) {
    return this.invoiceService.addServiceToInvoice(
      invoiceNumber,
      clientServiceId,
    );
  }
}
