import { Test, TestingModule } from '@nestjs/testing';
import { FornecedoresService } from './fornecedores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fornecedor } from '../entities/fornecedor.entity';

describe('FornecedoresService', () => {
  let service: FornecedoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FornecedoresService,
        {
          provide: getRepositoryToken(Fornecedor),
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

    service = module.get<FornecedoresService>(FornecedoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return array of fornecedores', async () => {
    expect(await service.findAll()).toEqual([]);
  });
});
