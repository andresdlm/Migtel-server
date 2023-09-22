import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateInvoiceDto,
  FilterInvoiceDto,
  UpdateInvoiceDto,
  UpdateInvoiceProductRelationDto,
  UpdateInvoiceServiceRelationDto,
} from '../dtos/invoice.dtos';
import { InvoicesService } from '../services/invoices.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { Put } from '@nestjs/common/decorators';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoiceService: InvoicesService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get()
  getAll(@Query() params: FilterInvoiceDto) {
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
  getCount() {
    return this.invoiceService.getCount();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.READER, Role.OPERATOR)
  @Get('search')
  search(@Query('searchParam') searchParam: string) {
    return this.invoiceService.search(searchParam);
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
  ) {
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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Put('setpaid/:invoiceId')
  setPaid(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
    return this.invoiceService.setPaid(invoiceId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id')
  updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateInvoiceDto,
  ) {
    return this.invoiceService.updateInvoice(id, payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id/updateReference')
  updateReference(
    @Param('id', ParseIntPipe) id: number,
    @Body() reference: { bankReference: string },
  ) {
    return this.invoiceService.updateReference(id, reference);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':id/updatePeriod')
  updatePeriod(
    @Param('id', ParseIntPipe) id: number,
    @Body() period: { period: string },
  ) {
    return this.invoiceService.updatePeriod(id, period);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':invoiceId/updateInvoiceProduct/:productId')
  updateInvoiceProduct(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() changes: UpdateInvoiceProductRelationDto,
  ) {
    return this.invoiceService.updateInvoiceProduct(
      invoiceId,
      productId,
      changes,
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':invoiceId/updateInvoiceService/:serviceId')
  updateInvoiceService(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Body() changes: UpdateInvoiceServiceRelationDto,
  ) {
    return this.invoiceService.updateInvoiceService(
      invoiceId,
      serviceId,
      changes,
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put(':invoiceId/updateInvoiceComment')
  updateInvoiceComment(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
    @Body() changes: { comment: string },
  ) {
    return this.invoiceService.updateInvoiceComment(invoiceId, changes);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id/creditNote')
  createCreditNote(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.createCreditNote(id);
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
