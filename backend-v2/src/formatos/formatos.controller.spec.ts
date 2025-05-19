import { Test, TestingModule } from '@nestjs/testing';
import { FormatosController } from './formatos.controller';

describe('FormatosController', () => {
  let controller: FormatosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormatosController],
    }).compile();

    controller = module.get<FormatosController>(FormatosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
