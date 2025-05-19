import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoFornecedorService } from './produto-fornecedor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProdutoFornecedor } from '../entities/produto-fornecedor.entity';
import { Produto } from '../entities/produto.entity';
import { Fornecedor } from '../entities/fornecedor.entity';

describe('ProdutoFornecedorService', () => {
  let service: ProdutoFornecedorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoFornecedorService,
        { provide: getRepositoryToken(ProdutoFornecedor), useValue: {} },
        { provide: getRepositoryToken(Produto), useValue: {} },
        { provide: getRepositoryToken(Fornecedor), useValue: {} },
      ],
    }).compile();

    service = module.get<ProdutoFornecedorService>(ProdutoFornecedorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
