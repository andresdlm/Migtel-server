import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceConceptsService } from './invoice-concepts.service';

describe('InvoiceConceptsService', () => {
  let service: InvoiceConceptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceConceptsService],
    }).compile();

    service = module.get<InvoiceConceptsService>(InvoiceConceptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
