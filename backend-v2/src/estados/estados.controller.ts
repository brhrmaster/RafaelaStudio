import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from '../entities/estado.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(RolesGuard)
@Controller('estados')
export class EstadosController {
  constructor(
    @InjectRepository(Estado)
    private estadosRepository: Repository<Estado>,
  ) {}

  @Roles('admin', 'controlador', 'visitante')
  @Get()
  async findAll() {
    return this.estadosRepository.find({
      order: { nome: 'ASC' },
    });
  }
}
