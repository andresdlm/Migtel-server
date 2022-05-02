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
  CreateConceptInvoiceDto,
  UpdateConceptInvoiceDto,
} from '../dtos/concepts-invoice.dtos';
import { ConceptsInvoiceService } from '../services/concepts-invoice.service';

@Controller('concepts-invoice')
export class ConceptsInvoiceController {
  constructor(private conceptInvoiceService: ConceptsInvoiceService) {}

  @Get()
  getAll() {
    return this.conceptInvoiceService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.conceptInvoiceService.findOne(id);
  }

  @Post('')
  create(@Body() payload: CreateConceptInvoiceDto) {
    return this.conceptInvoiceService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateConceptInvoiceDto,
  ) {
    return this.conceptInvoiceService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.conceptInvoiceService.delete(id);
  }
}
