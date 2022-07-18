import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvoiceServiceDto } from 'src/clients/dtos/client-service.dtos';
import { Repository } from 'typeorm';
import { InvoiceServices } from '../entities/invoice-service-relation.entity';

@Injectable()
export class InvoiceServicesService {
  constructor(
    @InjectRepository(InvoiceServices)
    private invoiceServiceRepo: Repository<InvoiceServices>,
  ) {}

  createRelationInvoice(data: CreateInvoiceServiceDto) {
    const newInvoiceConceptRel = this.invoiceServiceRepo.create(data);
    return this.invoiceServiceRepo.save(newInvoiceConceptRel);
  }
}
