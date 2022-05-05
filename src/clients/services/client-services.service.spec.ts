import { Test, TestingModule } from '@nestjs/testing';
import { ClientServicesService } from './client-services.service';

describe('ClientServicesService', () => {
  let service: ClientServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientServicesService],
    }).compile();

    service = module.get<ClientServicesService>(ClientServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
