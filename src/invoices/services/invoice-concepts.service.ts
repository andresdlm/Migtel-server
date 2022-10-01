import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { isNumber } from 'class-validator';

import { InvoiceConcept } from '../entities/invoice-concept.entity';
import {
  CreateInvoiceConceptDto,
  FilterInvoiceConceptDto,
  UpdateInvoiceConceptDto,
} from '../dtos/invoice-concept.dto';
import { CreateInvoiceConceptRelationDto } from '../dtos/invoice-concept-relation.dto';
import { InvoiceConceptRelation } from '../entities/invoice-concept-relation.entity';

@Injectable()
export class InvoiceConceptsService {
  constructor(
    @InjectRepository(InvoiceConcept)
    private invoiceConceptRepo: Repository<InvoiceConcept>,
    @InjectRepository(InvoiceConceptRelation)
    private invoiceConceptRelRepo: Repository<InvoiceConceptRelation>,
  ) {}

  findAll(params?: FilterInvoiceConceptDto) {
    if (params) {
      const { limit, offset, getArchive } = params;
      return this.invoiceConceptRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { archive: getArchive },
      });
    }
    return this.invoiceConceptRepo.find({
      order: { id: 'DESC' },
    });
  }

  findOne(invoiceConceptId: number) {
    const invoiceConcept = this.invoiceConceptRepo.findOne({
      where: {
        id: invoiceConceptId,
      },
    });
    if (!invoiceConcept) {
      throw new NotFoundException(
        `Invoice Concept #${invoiceConceptId} not found`,
      );
    }
    return invoiceConcept;
  }

  getCount(getArchive: boolean) {
    return this.invoiceConceptRepo.count({
      where: { archive: getArchive },
    });
  }

  async search(searchInput: string, getArchive: boolean) {
    if (isNumber(Number(searchInput))) {
      return this.invoiceConceptRepo.find({
        where: [
          { id: Number(searchInput), archive: getArchive },
          { price: Number(searchInput), archive: getArchive },
        ],
      });
    } else {
      return this.invoiceConceptRepo.find({
        where: [
          {
            invoiceDescription: ILike(`%${searchInput}%`),
            archive: getArchive,
          },
        ],
      });
    }
  }

  create(data: CreateInvoiceConceptDto) {
    const newInvoiceConcept = this.invoiceConceptRepo.create(data);
    return this.invoiceConceptRepo.save(newInvoiceConcept);
  }

  async update(id: number, changes: UpdateInvoiceConceptDto) {
    const concept = await this.findOne(id);
    this.invoiceConceptRepo.merge(concept, changes);
    return this.invoiceConceptRepo.save(concept);
  }

  async archive(id: number) {
    const concept = await this.findOne(id);
    concept.archive = !concept.archive;
    return this.invoiceConceptRepo.save(concept);
  }

  createRelationInvoice(data: CreateInvoiceConceptRelationDto) {
    const newInvoiceConceptRel = this.invoiceConceptRelRepo.create(data);
    return this.invoiceConceptRelRepo.save(newInvoiceConceptRel);
  }
}
