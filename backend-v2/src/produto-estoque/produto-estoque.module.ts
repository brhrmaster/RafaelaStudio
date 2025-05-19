import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoEstoque } from '../entities/produto-estoque.entity';
import { ProdutoEstoqueService } from './produto-estoque.service';
import { ProdutoEstoqueController } from './produto-estoque.controller';
import { Produto } from '../entities/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutoEstoque, Produto])],
  controllers: [ProdutoEstoqueController],
  providers: [ProdutoEstoqueService],
  exports: [ProdutoEstoqueService],
})
export class ProdutoEstoqueModule {}
