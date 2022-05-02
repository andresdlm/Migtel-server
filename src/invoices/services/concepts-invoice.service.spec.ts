import { Test, TestingModule } from '@nestjs/testing';
import { ConceptsInvoiceService } from './concepts-invoice.service';

describe('ConceptsInvoiceService', () => {
  let service: ConceptsInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConceptsInvoiceService],
    }).compile();

    service = module.get<ConceptsInvoiceService>(ConceptsInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
