import { Test, TestingModule } from '@nestjs/testing';
import { ActaComplianceController } from './acta-compliance.controller';
import { ActaComplianceService } from './acta-compliance.service';

describe('ActaComplianceController', () => {
  let controller: ActaComplianceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActaComplianceController],
      providers: [ActaComplianceService],
    }).compile();

    controller = module.get<ActaComplianceController>(ActaComplianceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
