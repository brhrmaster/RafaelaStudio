import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoFornecedorController } from './produto-fornecedor.controller';

describe('ProdutoFornecedorController', () => {
  let controller: ProdutoFornecedorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoFornecedorController],
    }).compile();

    controller = module.get<ProdutoFornecedorController>(
      ProdutoFornecedorController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
