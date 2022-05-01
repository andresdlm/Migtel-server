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
import { CreateInvoiceDto, UpdateInvoiceDto } from '../dtos/invoices.dtos';
import { InvoicesService } from '../services/invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoiceService: InvoicesService) {}

  @Get()
  getAll() {
    return this.invoiceService.findAll();
  }

  @Get(':invoice_number')
  getOne(@Param(':invoice_number', ParseIntPipe) invoice_number: number) {
    return this.invoiceService.findOne(invoice_number);
  }

  @Post('')
  create(@Body() payload: CreateInvoiceDto) {
    return this.invoiceService.create(payload);
  }

  @Put(':invoice_number')
  update(
    @Param('invoice_number', ParseIntPipe) invoice_number: number,
    @Body() payload: UpdateInvoiceDto,
  ) {
    return this.invoiceService.update(invoice_number, payload);
  }

  @Delete(':invoice_number')
  delete(@Param('invoice_number', ParseIntPipe) invoice_number: number) {
    return this.invoiceService.delete(invoice_number);
  }
}
