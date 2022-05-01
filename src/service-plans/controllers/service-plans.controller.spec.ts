import { Test, TestingModule } from '@nestjs/testing';
import { ServicePlansController } from './service-plans.controller';

describe('ServicePlansController', () => {
  let controller: ServicePlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicePlansController],
    }).compile();

    controller = module.get<ServicePlansController>(ServicePlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
