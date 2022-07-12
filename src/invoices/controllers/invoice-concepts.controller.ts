import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { InvoiceConceptsService } from '../services/invoice-concepts.service';
import { CreateInvoiceConceptDto } from '../dtos/invoice-concept.dto';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('invoice-concepts')
export class InvoiceConceptsController {
  constructor(private invoiceConceptsService: InvoiceConceptsService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get()
  getAll() {
    return this.invoiceConceptsService.findAll();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get(':invoiceConcept')
  getOne(@Param('invoiceConcept', ParseIntPipe) invoiceConcept: number) {
    return this.invoiceConceptsService.findOne(invoiceConcept);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('')
  create(@Body() payload: CreateInvoiceConceptDto) {
    return this.invoiceConceptsService.create(payload);
  }
}
