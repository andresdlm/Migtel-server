import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateConceptInvoiceDto,
  UpdateConceptInvoiceDto,
} from '../dtos/concepts-invoice.dtos';
import { ConceptsInvoice } from '../entities/concepts-invoice.entity';

@Injectable()
export class ConceptsInvoiceService {
  constructor(
    @InjectRepository(ConceptsInvoice)
    private conceptInvoiceRepo: Repository<ConceptsInvoice>,
  ) {}

  findAll() {
    return this.conceptInvoiceRepo.find();
  }

  findOne(id: number) {
    const serviceClient = this.conceptInvoiceRepo.findOne(id);
    if (!serviceClient) {
      throw new NotFoundException(`Service Client #${id} not found`);
    }
    return serviceClient;
  }

  create(data: CreateConceptInvoiceDto) {
    const newServiceClient = this.conceptInvoiceRepo.create(data);
    return this.conceptInvoiceRepo.save(newServiceClient);
  }

  async update(id: number, changes: UpdateConceptInvoiceDto) {
    const serviceClient = await this.conceptInvoiceRepo.findOne(id);
    this.conceptInvoiceRepo.merge(serviceClient, changes);
    return this.conceptInvoiceRepo.save(serviceClient);
  }

  delete(id: number) {
    return this.conceptInvoiceRepo.delete(id);
  }
}
