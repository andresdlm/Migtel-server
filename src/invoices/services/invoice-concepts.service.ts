import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateInvoiceConceptDto,
  UpdateInvoiceConceptDto,
} from '../dtos/invoice-concept.dtos';
import { InvoiceConcept } from '../entities/invoice-concept.entity';
import { InvoicesService } from './invoices.service';
import { ClientServicesService } from 'src/clients/services/client-services.service';

@Injectable()
export class InvoiceConceptsService {
  constructor(
    @InjectRepository(InvoiceConcept)
    private invoiceConceptRepo: Repository<InvoiceConcept>,
    private invoicesService: InvoicesService,
    private clientServiceService: ClientServicesService,
  ) {}

  findAll() {
    return this.invoiceConceptRepo.find();
  }

  findOne(id: number) {
    const invoiceConcept = this.invoiceConceptRepo.findOne(id);
    if (!invoiceConcept) {
      throw new NotFoundException(`Invoice Concept #${id} not found`);
    }
    return invoiceConcept;
  }

  async create(data: CreateInvoiceConceptDto) {
    const newInvoiceConcept = this.invoiceConceptRepo.create(data);
    if (data.invoiceNumber) {
      const invoice = await this.invoicesService.findOne(data.invoiceNumber);
      newInvoiceConcept.invoice = invoice;
    }
    if (data.clientServiceId) {
      const clientService = await this.clientServiceService.findOne(
        data.clientServiceId,
      );
      newInvoiceConcept.clientService = clientService;
    }
    return this.invoiceConceptRepo.save(newInvoiceConcept);
  }

  async update(id: number, changes: UpdateInvoiceConceptDto) {
    const invoiceConcept = await this.invoiceConceptRepo.findOne(id);
    if (changes.invoiceNumber) {
      const invoice = await this.invoicesService.findOne(changes.invoiceNumber);
      invoiceConcept.invoice = invoice;
    }
    if (changes.clientServiceId) {
      const clientService = await this.clientServiceService.findOne(
        changes.clientServiceId,
      );
      invoiceConcept.clientService = clientService;
    }
    this.invoiceConceptRepo.merge(invoiceConcept, changes);
    return this.invoiceConceptRepo.save(invoiceConcept);
  }

  delete(id: number) {
    return this.invoiceConceptRepo.delete(id);
  }
}
