import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceServicesService } from './invoice-services.service';

describe('InvoiceServicesService', () => {
  let service: InvoiceServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceServicesService],
    }).compile();

    service = module.get<InvoiceServicesService>(InvoiceServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
