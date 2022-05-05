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
import {
  CreateInvoiceConceptDto,
  UpdateInvoiceConceptDto,
} from '../dtos/invoice-concept.dtos';
import { InvoiceConceptsService } from '../services/invoice-concepts.service';

@Controller('invoice-concepts')
export class InvoiceConceptsController {
  constructor(private invoiceConceptsService: InvoiceConceptsService) {}

  @Get()
  getAll() {
    return this.invoiceConceptsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceConceptsService.findOne(id);
  }

  @Post('')
  create(@Body() payload: CreateInvoiceConceptDto) {
    return this.invoiceConceptsService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateInvoiceConceptDto,
  ) {
    return this.invoiceConceptsService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceConceptsService.delete(id);
  }
}
