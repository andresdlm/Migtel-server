import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';

import { Invoice } from 'src/invoices/entities/invoice.entity';
import { SalesBookDto } from '../dtos/salesBook.dto';

@Injectable()
export class ReportsLogicService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
  ) {}

  generateSalesBook(params: SalesBookDto) {
    return this.invoiceRepo.find({
      where: {
        registerDate: Raw(
          (alias) => `${alias} >= :since AND ${alias} <= :until`,
          {
            since: `${params.since.toISOString()}`,
            until: `${params.until.toISOString()}`,
          },
        ),
      },
      relations: {
        client: true,
      },
      order: {
        invoiceNumber: 'ASC',
      },
    });
  }
}
