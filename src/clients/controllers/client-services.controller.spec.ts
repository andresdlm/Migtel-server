import { Test, TestingModule } from '@nestjs/testing';
import { ClientServicesController } from './client-services.controller';

describe('ClientServicesController', () => {
  let controller: ClientServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientServicesController],
    }).compile();

    controller = module.get<ClientServicesController>(ClientServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
