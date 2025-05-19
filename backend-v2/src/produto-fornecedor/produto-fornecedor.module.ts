import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoFornecedor } from '../entities/produto-fornecedor.entity';
import { Produto } from '../entities/produto.entity';
import { Fornecedor } from '../entities/fornecedor.entity';
import { ProdutoFornecedorService } from './produto-fornecedor.service';
import { ProdutoFornecedorController } from './produto-fornecedor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutoFornecedor, Produto, Fornecedor])],
  controllers: [ProdutoFornecedorController],
  providers: [ProdutoFornecedorService],
  exports: [ProdutoFornecedorService],
})
export class ProdutoFornecedorModule {}
