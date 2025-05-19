import { Test, TestingModule } from '@nestjs/testing';
import { FormatosService } from './formatos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Formato } from '../entities/formato.entity';

describe('FormatosService', () => {
  let service: FormatosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormatosService,
        {
          provide: getRepositoryToken(Formato),
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

    service = module.get<FormatosService>(FormatosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return array of formatos', async () => {
    expect(await service.findAll()).toEqual([]);
  });
});
