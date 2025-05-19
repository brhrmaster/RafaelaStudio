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
import { FormatosService } from './formatos.service';
import { CreateFormatoDto } from '../dto/create-formato.dto';
import { UpdateFormatoDto } from '../dto/update-formato.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(RolesGuard)
@Controller('formatos')
export class FormatosController {
  constructor(private readonly formatosService: FormatosService) {}

  @Roles('admin', 'controlador')
  @Post()
  create(@Body() dto: CreateFormatoDto) {
    return this.formatosService.create(dto);
  }

  @Get()
  findAll() {
    return this.formatosService.findAll();
  }

  @Roles('admin', 'controlador', 'visitante')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formatosService.findOne(+id);
  }

  @Roles('admin', 'controlador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFormatoDto) {
    return this.formatosService.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formatosService.remove(+id);
  }
}
