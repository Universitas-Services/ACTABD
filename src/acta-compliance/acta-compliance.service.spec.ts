import { Test, TestingModule } from '@nestjs/testing';
import { ActaComplianceService } from './acta-compliance.service';

describe('ActaComplianceService', () => {
  let service: ActaComplianceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActaComplianceService],
    }).compile();

    service = module.get<ActaComplianceService>(ActaComplianceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
