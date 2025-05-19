import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProdutoEstoqueService } from './produto-estoque.service';
import { CreateProdutoEstoqueDto } from '../dto/create-produto-estoque.dto';
import { UpdateProdutoEstoqueDto } from '../dto/update-produto-estoque.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(RolesGuard)
@Controller('produto-estoque')
export class ProdutoEstoqueController {
  constructor(private readonly peService: ProdutoEstoqueService) {}

  @Roles('admin', 'controlador')
  @Post()
  create(@Body() dto: CreateProdutoEstoqueDto) {
    return this.peService.create(dto);
  }

  @Roles('admin', 'controlador', 'visitante')
  @Get()
  findAll() {
    return this.peService.findAll();
  }

  @Roles('admin', 'controlador', 'visitante')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peService.findOne(+id);
  }

  @Roles('admin', 'controlador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProdutoEstoqueDto) {
    return this.peService.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.peService.remove(+id);
  }

  @Roles('admin', 'controlador', 'visitante')
  @Get('/produto/:produtoId')
  findByProduto(@Param('produtoId') produtoId: string) {
    return this.peService.findByProduto(+produtoId);
  }
}
