import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fornecedor } from '../entities/fornecedor.entity';
import { Cidade } from '../entities/cidade.entity';
import { FornecedoresService } from './fornecedores.service';
import { FornecedoresController } from './fornecedores.controller';
import { Produto } from '../entities/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fornecedor, Cidade, Produto])],
  controllers: [FornecedoresController],
  providers: [FornecedoresService],
  exports: [FornecedoresService],
})
export class FornecedoresModule {}
