import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateConceptInvoiceDto,
  UpdateConceptInvoiceDto,
} from '../dtos/concepts-invoice.dtos';
import { ConceptsInvoice } from '../entities/concepts-invoice.entity';
import { InvoicesService } from './invoices.service';
import { ServicesClientService } from 'src/clients/services/services-client.service';

@Injectable()
export class ConceptsInvoiceService {
  constructor(
    @InjectRepository(ConceptsInvoice)
    private conceptInvoiceRepo: Repository<ConceptsInvoice>,
    private invoiceService: InvoicesService,
    private servicesClientService: ServicesClientService,
  ) {}

  findAll() {
    return this.conceptInvoiceRepo.find();
  }

  findOne(id: number) {
    const conceptInvoice = this.conceptInvoiceRepo.findOne(id);
    if (!conceptInvoice) {
      throw new NotFoundException(`Service Client #${id} not found`);
    }
    return conceptInvoice;
  }

  async create(data: CreateConceptInvoiceDto) {
    const newConceptInvoice = this.conceptInvoiceRepo.create(data);
    if (data.invoiceInvoiceNumber) {
      const invoice = await this.invoiceService.findOne(
        data.invoiceInvoiceNumber,
      );
      newConceptInvoice.invoice = invoice;
    }
    if (data.serviceClientId) {
      const servicePlan = await this.servicesClientService.findOne(
        data.serviceClientId,
      );
      newConceptInvoice.serviceClient = servicePlan;
    }
    return this.conceptInvoiceRepo.save(newConceptInvoice);
  }

  async update(id: number, changes: UpdateConceptInvoiceDto) {
    const conceptInvoice = await this.conceptInvoiceRepo.findOne(id);
    if (changes.invoiceInvoiceNumber) {
      const invoice = await this.invoiceService.findOne(
        changes.invoiceInvoiceNumber,
      );
      conceptInvoice.invoice = invoice;
    }
    if (changes.serviceClientId) {
      const servicePlan = await this.servicesClientService.findOne(
        changes.serviceClientId,
      );
      conceptInvoice.serviceClient = servicePlan;
    }
    this.conceptInvoiceRepo.merge(conceptInvoice, changes);
    return this.conceptInvoiceRepo.save(conceptInvoice);
  }

  delete(id: number) {
    return this.conceptInvoiceRepo.delete(id);
  }
}
