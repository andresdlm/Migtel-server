import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateInvoiceDto, UpdateInvoiceDto } from '../dtos/invoices.dtos';
import { Invoices } from '../entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoices) private invoiceRepo: Repository<Invoices>,
  ) {}

  findAll() {
    return this.invoiceRepo.find();
  }

  findOne(invoice_number: number) {
    const invoice = this.invoiceRepo.findOne(invoice_number);
    if (!invoice) {
      throw new NotFoundException(`Invoice #${invoice_number} not found`);
    }
    return invoice;
  }

  create(data: CreateInvoiceDto) {
    const newInvoice = this.invoiceRepo.create(data);
    return this.invoiceRepo.save(newInvoice);
  }

  async update(invoice_number: number, changes: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepo.findOne(invoice_number);
    this.invoiceRepo.merge(invoice, changes);
    return this.invoiceRepo.save(invoice);
  }

  delete(invoice_number: number) {
    return this.invoiceRepo.delete(invoice_number);
  }
}
