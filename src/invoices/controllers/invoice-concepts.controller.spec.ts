import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceConceptsController } from './invoice-concepts.controller';

describe('InvoiceConceptsController', () => {
  let controller: InvoiceConceptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceConceptsController],
    }).compile();

    controller = module.get<InvoiceConceptsController>(InvoiceConceptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
