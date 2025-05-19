import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProdutoEstoque } from '../entities/produto-estoque.entity';
import { CreateProdutoEstoqueDto } from '../dto/create-produto-estoque.dto';
import { UpdateProdutoEstoqueDto } from '../dto/update-produto-estoque.dto';
import { Produto } from '../entities/produto.entity';

@Injectable()
export class ProdutoEstoqueService {
  constructor(
    @InjectRepository(ProdutoEstoque)
    private peRepository: Repository<ProdutoEstoque>,
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async create(dto: CreateProdutoEstoqueDto): Promise<ProdutoEstoque> {
    const produto = await this.produtoRepository.findOne({
      where: { id: dto.produtoId },
    });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    const pe = this.peRepository.create({
      tipo: dto.tipo,
      produto,
      total: dto.total,
      validade: dto.validade ? new Date(dto.validade) : null,
      qtd_clientes: dto.qtd_clientes,
      qtd_cursos: dto.qtd_cursos,
    });
    return this.peRepository.save(pe);
  }

  async findAll(): Promise<ProdutoEstoque[]> {
    return this.peRepository.find();
  }

  async findOne(id: number): Promise<ProdutoEstoque> {
    const pe = await this.peRepository.findOne({ where: { id } });
    if (!pe)
      throw new NotFoundException('Movimentação de estoque não encontrada');
    return pe;
  }

  async update(
    id: number,
    dto: UpdateProdutoEstoqueDto,
  ): Promise<ProdutoEstoque> {
    const pe = await this.findOne(id);
    Object.assign(pe, dto);
    if (dto.produtoId) {
      const produto = await this.produtoRepository.findOne({
        where: { id: dto.produtoId },
      });
      if (!produto) throw new NotFoundException('Produto não encontrado');
      pe.produto = produto;
    }
    return this.peRepository.save(pe);
  }

  async remove(id: number): Promise<void> {
    await this.peRepository.delete(id);
  }

  async findByProduto(produtoId: number): Promise<ProdutoEstoque[]> {
    return this.peRepository.find({ where: { produto: { id: produtoId } } });
  }
}
