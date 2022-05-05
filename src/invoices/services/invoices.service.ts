import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateInvoiceDto, UpdateInvoiceDto } from '../dtos/invoice.dtos';
import { Invoice } from '../entities/invoice.entity';

import { ClientsService } from 'src/clients/services/clients.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    private clientsService: ClientsService,
  ) {}

  findAll() {
    return this.invoiceRepo.find();
  }

  findOne(invoiceNumber: number) {
    const invoice = this.invoiceRepo.findOne(invoiceNumber);
    if (!invoice) {
      throw new NotFoundException(`Invoice #${invoiceNumber} not found`);
    }
    return invoice;
  }

  async create(data: CreateInvoiceDto) {
    const newInvoice = this.invoiceRepo.create(data);
    if (data.clientId) {
      const client = await this.clientsService.findOne(data.clientId);
      newInvoice.client = client;
    }
    return this.invoiceRepo.save(newInvoice);
  }

  async update(invoiceNumber: number, changes: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepo.findOne(invoiceNumber);
    if (changes.clientId) {
      const client = await this.clientsService.findOne(changes.clientId);
      invoice.client = client;
    }
    this.invoiceRepo.merge(invoice, changes);
    return this.invoiceRepo.save(invoice);
  }

  delete(invoiceNumber: number) {
    return this.invoiceRepo.delete(invoiceNumber);
  }
}
