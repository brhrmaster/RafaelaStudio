import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoEstoqueDto } from './create-produto-estoque.dto';

export class UpdateProdutoEstoqueDto extends PartialType(
  CreateProdutoEstoqueDto,
) {}
