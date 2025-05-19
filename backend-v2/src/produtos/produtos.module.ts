import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from '../entities/produto.entity';
import { Formato } from '../entities/formato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Formato])],
  controllers: [ProdutosController],
  providers: [ProdutosService],
  exports: [ProdutosService],
})
export class ProdutosModule {}
