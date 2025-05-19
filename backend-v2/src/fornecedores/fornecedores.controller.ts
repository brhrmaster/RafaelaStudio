import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FornecedoresService } from './fornecedores.service';
import { CreateFornecedorDto } from '../dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from '../dto/update-fornecedor.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(RolesGuard)
@Controller('fornecedores')
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

  @Roles('admin', 'controlador')
  @Post()
  create(@Body() dto: CreateFornecedorDto) {
    return this.fornecedoresService.create(dto);
  }

  @Roles('admin', 'controlador', 'visitante')
  @Get()
  findAll() {
    return this.fornecedoresService.findAll();
  }

  @Roles('admin', 'controlador', 'visitante')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fornecedoresService.findOne(+id);
  }

  @Roles('admin', 'controlador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFornecedorDto) {
    return this.fornecedoresService.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fornecedoresService.remove(+id);
  }
}
