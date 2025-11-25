import { Test, TestingModule } from '@nestjs/testing';
import { AuditAiService } from './audit-ai.service';

describe('AuditAiService', () => {
  let service: AuditAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditAiService],
    }).compile();

    service = module.get<AuditAiService>(AuditAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
