import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service'; // Importa el servicio
describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      // La clave está en la estructura de este array 👇
      providers: [
        {
          provide: UsersService, // La dependencia que necesita el controlador
          useValue: {}, // Un objeto falso que la reemplaza en el test
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
