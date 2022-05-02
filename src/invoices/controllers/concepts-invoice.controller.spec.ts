import { Test, TestingModule } from '@nestjs/testing';
import { ConceptsInvoiceController } from './concepts-invoice.controller';

describe('ConceptsInvoiceController', () => {
  let controller: ConceptsInvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConceptsInvoiceController],
    }).compile();

    controller = module.get<ConceptsInvoiceController>(
      ConceptsInvoiceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
