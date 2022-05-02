import { Test, TestingModule } from '@nestjs/testing';
import { ServicesClientService } from './services-client.service';

describe('ServicesClientService', () => {
  let service: ServicesClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicesClientService],
    }).compile();

    service = module.get<ServicesClientService>(ServicesClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
