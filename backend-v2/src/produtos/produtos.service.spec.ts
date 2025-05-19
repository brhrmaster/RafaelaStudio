import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Produto } from '../entities/produto.entity';

describe('ProdutosService', () => {
  let service: ProdutosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: getRepositoryToken(Produto),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return array of products', async () => {
    expect(await service.findAll()).toEqual([]);
  });
});
