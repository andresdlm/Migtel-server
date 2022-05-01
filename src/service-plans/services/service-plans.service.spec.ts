import { Test, TestingModule } from '@nestjs/testing';
import { ServicePlansService } from './service-plans.service';

describe('ServicePlansService', () => {
  let service: ServicePlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicePlansService],
    }).compile();

    service = module.get<ServicePlansService>(ServicePlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
