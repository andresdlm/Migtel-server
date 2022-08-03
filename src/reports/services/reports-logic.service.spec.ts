import { Test, TestingModule } from '@nestjs/testing';
import { ReportsLogicService } from './reports-logic.service';

describe('ReportsLogicService', () => {
  let service: ReportsLogicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsLogicService],
    }).compile();

    service = module.get<ReportsLogicService>(ReportsLogicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
