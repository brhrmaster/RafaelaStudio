import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fornecedor } from '../entities/fornecedor.entity';
import { CreateFornecedorDto } from '../dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from '../dto/update-fornecedor.dto';
import { Cidade } from '../entities/cidade.entity';
import { ProdutoFornecedor } from '../entities/produto-fornecedor.entity';
import { Produto } from '../entities/produto.entity';

@Injectable()
export class FornecedoresService {
  constructor(
    @InjectRepository(Fornecedor)
    private fornecedoresRepository: Repository<Fornecedor>,
    @InjectRepository(Cidade)
    private cidadesRepository: Repository<Cidade>,
    @InjectRepository(Produto)
    private produtosRepository: Repository<Produto>,
  ) {}

  async create(dto: CreateFornecedorDto): Promise<Fornecedor> {
    const fornecedor = this.fornecedoresRepository.create(dto);
    const cidade = await this.cidadesRepository.findOne({
      where: { id: dto.cidadeId },
    });
    if (!cidade) throw new NotFoundException('Cidade não encontrada');
    fornecedor.cidade = cidade;

    // Associa produtos se enviados
    if (dto.produtoIds && dto.produtoIds.length > 0) {
      fornecedor.produtosFornecedores = [];
      for (const produtoId of dto.produtoIds) {
        const produto = await this.produtosRepository.findOne({
          where: { id: produtoId },
        });
        if (produto) {
          const pf = new ProdutoFornecedor();
          pf.produto = produto;
          pf.fornecedor = fornecedor;
          fornecedor.produtosFornecedores.push(pf);
        }
      }
    }
    return this.fornecedoresRepository.save(fornecedor);
  }

  async findAll(): Promise<Fornecedor[]> {
    return this.fornecedoresRepository.find();
  }

  async findOne(id: number): Promise<Fornecedor> {
    const fornecedor = await this.fornecedoresRepository.findOne({
      where: { id },
      relations: ['produtosFornecedores', 'produtosFornecedores.produto'],
    });
    if (!fornecedor) throw new NotFoundException('Fornecedor não encontrado');
    return fornecedor;
  }

  async update(id: number, dto: UpdateFornecedorDto): Promise<Fornecedor> {
    const fornecedor = await this.findOne(id);
    Object.assign(fornecedor, dto);
    const cidade = await this.cidadesRepository.findOne({
      where: { id: dto.cidadeId },
    });
    if (!cidade) throw new NotFoundException('Cidade não encontrada');
    fornecedor.cidade = cidade;
    return this.fornecedoresRepository.save(fornecedor);
  }

  async remove(id: number): Promise<void> {
    await this.fornecedoresRepository.delete(id);
  }
}
