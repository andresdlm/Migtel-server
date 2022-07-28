import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { InvoiceConceptsService } from '../services/invoice-concepts.service';
import {
  CreateInvoiceConceptDto,
  FilterInvoiceConceptDto,
} from '../dtos/invoice-concept.dto';

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
  getAll(
    @Query() params: FilterInvoiceConceptDto,
    @Query('getArchive', ParseBoolPipe) getArchive?: boolean,
  ) {
    if (params) params.getArchive = getArchive;
    return this.invoiceConceptsService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get('count')
  getCount(@Query('getArchive', ParseBoolPipe) getArchive: boolean) {
    return this.invoiceConceptsService.getCount(getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER)
  @Get('search')
  search(
    @Query('searchParam') searchParam: string,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    return this.invoiceConceptsService.search(searchParam, getArchive);
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
