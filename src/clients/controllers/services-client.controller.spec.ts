import { Test, TestingModule } from '@nestjs/testing';
import { ServicesClientController } from './services-client.controller';

describe('ServicesClientController', () => {
  let controller: ServicesClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesClientController],
    }).compile();

    controller = module.get<ServicesClientController>(ServicesClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
