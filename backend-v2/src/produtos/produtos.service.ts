import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { Formato } from '../entities/formato.entity';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private produtosRepository: Repository<Produto>,
    @InjectRepository(Formato)
    private formatosRepository: Repository<Formato>,
  ) {}

  async create(dto: CreateProdutoDto): Promise<Produto> {
    const produto = this.produtosRepository.create(dto);
    if (dto.formatoId) {
      const formato = await this.formatosRepository.findOne({
        where: { id: dto.formatoId },
      });
      if (formato) produto.formato = formato;
    }
    return this.produtosRepository.save(produto);
  }

  async findAll(): Promise<Produto[]> {
    return this.produtosRepository.find();
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtosRepository.findOne({ where: { id } });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async update(id: number, dto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    Object.assign(produto, dto);
    if (dto.formatoId) {
      const formato = await this.formatosRepository.findOne({
        where: { id: dto.formatoId },
      });
      if (formato) produto.formato = formato;
    }
    return this.produtosRepository.save(produto);
  }

  async remove(id: number): Promise<void> {
    await this.produtosRepository.delete(id);
  }
}
