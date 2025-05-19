import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProdutoFornecedor } from '../entities/produto-fornecedor.entity';
import { CreateProdutoFornecedorDto } from '../dto/create-produto-fornecedor.dto';
import { Produto } from '../entities/produto.entity';
import { Fornecedor } from '../entities/fornecedor.entity';

@Injectable()
export class ProdutoFornecedorService {
  constructor(
    @InjectRepository(ProdutoFornecedor)
    private pfRepository: Repository<ProdutoFornecedor>,
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    @InjectRepository(Fornecedor)
    private fornecedoresRepository: Repository<Fornecedor>,
  ) {}

  async create(dto: CreateProdutoFornecedorDto): Promise<ProdutoFornecedor> {
    const produto = await this.produtoRepository.findOne({
      where: { id: dto.produtoId },
    });
    if (!produto) throw new NotFoundException('Produto não encontrado');

    const fornecedor = await this.fornecedoresRepository.findOne({
      where: { id: dto.fornecedorId },
    });
    if (!fornecedor) throw new NotFoundException('Fornecedor não encontrado');

    const pf = this.pfRepository.create({
      produto,
      fornecedor,
      ativo: dto.ativo ?? true,
    });
    return this.pfRepository.save(pf);
  }

  async findAll(): Promise<ProdutoFornecedor[]> {
    return this.pfRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.pfRepository.delete(id);
  }

  // Lista todos fornecedores de um produto específico
  async fornecedoresDoProduto(produtoId: number): Promise<ProdutoFornecedor[]> {
    return this.pfRepository.find({ where: { produto: { id: produtoId } } });
  }

  // Lista todos produtos de um fornecedor específico
  async produtosDoFornecedor(
    fornecedorId: number,
  ): Promise<ProdutoFornecedor[]> {
    return this.pfRepository.find({
      where: { fornecedor: { id: fornecedorId } },
    });
  }
}
