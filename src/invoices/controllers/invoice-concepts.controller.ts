import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { InvoiceConceptsService } from '../services/invoice-concepts.service';
import {
  CreateInvoiceConceptDto,
  FilterInvoiceConceptDto,
  UpdateInvoiceConceptDto,
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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get()
  getAll(
    @Query() params: FilterInvoiceConceptDto,
    @Query('getArchive', ParseBoolPipe) getArchive?: boolean,
  ) {
    if (params) params.getArchive = getArchive;
    return this.invoiceConceptsService.findAll(params);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('count')
  getCount(@Query('getArchive', ParseBoolPipe) getArchive: boolean) {
    return this.invoiceConceptsService.getCount(getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('search')
  search(
    @Query('searchParam') searchParam: string,
    @Query('getArchive', ParseBoolPipe) getArchive: boolean,
  ) {
    return this.invoiceConceptsService.search(searchParam, getArchive);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get(':invoiceConcept')
  getOne(@Param('invoiceConcept', ParseIntPipe) invoiceConcept: number) {
    return this.invoiceConceptsService.findOne(invoiceConcept);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('')
  create(@Body() payload: CreateInvoiceConceptDto) {
    return this.invoiceConceptsService.create(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateInvoiceConceptDto,
  ) {
    return this.invoiceConceptsService.update(id, payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('archive/:id')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceConceptsService.archive(id);
  }
}
