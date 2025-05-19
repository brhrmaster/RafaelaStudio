import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProdutoFornecedorService } from './produto-fornecedor.service';
import { CreateProdutoFornecedorDto } from '../dto/create-produto-fornecedor.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(RolesGuard)
@Controller('produto-fornecedor')
export class ProdutoFornecedorController {
  constructor(private readonly pfService: ProdutoFornecedorService) {}

  @Roles('admin', 'controlador')
  @Post()
  create(@Body() dto: CreateProdutoFornecedorDto) {
    return this.pfService.create(dto);
  }

  @Roles('admin', 'controlador', 'visitante')
  @Get()
  findAll() {
    return this.pfService.findAll();
  }

  @Roles('admin', 'controlador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pfService.remove(+id);
  }

  @Roles('admin', 'controlador', 'visitante')
  @Get('produto/:produtoId')
  fornecedoresDoProduto(@Param('produtoId') produtoId: string) {
    return this.pfService.fornecedoresDoProduto(+produtoId);
  }

  @Roles('admin', 'controlador', 'visitante')
  @Get('fornecedor/:fornecedorId')
  produtosDoFornecedor(@Param('fornecedorId') fornecedorId: string) {
    return this.pfService.produtosDoFornecedor(+fornecedorId);
  }
}
