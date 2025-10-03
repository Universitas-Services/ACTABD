import { Test, TestingModule } from '@nestjs/testing';
import { ActasService } from './actas.service';

describe('ActasService', () => {
  let service: ActasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActasService],
    }).compile();

    service = module.get<ActasService>(ActasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
