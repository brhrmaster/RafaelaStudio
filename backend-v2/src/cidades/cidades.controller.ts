import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidade } from '../entities/cidade.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(RolesGuard)
@Controller('cidades')
export class CidadesController {
  constructor(
    @InjectRepository(Cidade)
    private cidadesRepository: Repository<Cidade>,
  ) {}

  @Roles('admin', 'controlador', 'visitante')
  @Get(':estadoId')
  async findByEstado(@Param('estadoId') estadoId: number) {
    return this.cidadesRepository.find({
      where: { estado: { id: estadoId } },
      order: { nome: 'ASC' },
    });
  }
}
