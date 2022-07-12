import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InvoiceConcept } from '../entities/invoice-concept.entity';
import { CreateInvoiceConceptDto } from '../dtos/invoice-concept.dto';

@Injectable()
export class InvoiceConceptsService {
  constructor(
    @InjectRepository(InvoiceConcept)
    private invoiceConceptRepo: Repository<InvoiceConcept>,
  ) {}

  findAll() {
    return this.invoiceConceptRepo.find({
      order: { id: 'ASC' },
    });
  }

  findOne(invoiceConceptId: number) {
    const invoiceConcept = this.invoiceConceptRepo.findOne(invoiceConceptId);
    if (!invoiceConcept) {
      throw new NotFoundException(
        `Invoice Concept #${invoiceConceptId} not found`,
      );
    }
    return invoiceConcept;
  }

  create(data: CreateInvoiceConceptDto) {
    const newInvoiceConcept = this.invoiceConceptRepo.create(data);
    return this.invoiceConceptRepo.save(newInvoiceConcept);
  }
}
