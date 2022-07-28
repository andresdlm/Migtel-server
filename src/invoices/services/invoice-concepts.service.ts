import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Raw, Repository } from 'typeorm';
import { isNumber } from 'class-validator';

import { InvoiceConcept } from '../entities/invoice-concept.entity';
import {
  CreateInvoiceConceptDto,
  FilterInvoiceConceptDto,
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
    const invoiceConcept = this.invoiceConceptRepo.findOne(invoiceConceptId);
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
          { id: searchInput, archive: getArchive },
          { price: searchInput, archive: getArchive },
        ],
      });
    } else {
      return await getRepository(InvoiceConcept).find({
        where: [
          {
            ['invoiceDescription']: Raw(
              (invoiceDescription) =>
                `LOWER(${invoiceDescription}) Like '%${searchInput.toLowerCase()}%'`,
            ),
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

  createRelationInvoice(data: CreateInvoiceConceptRelationDto) {
    const newInvoiceConceptRel = this.invoiceConceptRelRepo.create(data);
    return this.invoiceConceptRelRepo.save(newInvoiceConceptRel);
  }
}
