import { Test, TestingModule } from '@nestjs/testing';
import { ActasController } from './actas.controller';

describe('ActasController', () => {
  let controller: ActasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActasController],
    }).compile();

    controller = module.get<ActasController>(ActasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
