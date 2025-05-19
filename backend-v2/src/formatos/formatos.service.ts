import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formato } from '../entities/formato.entity';
import { CreateFormatoDto } from '../dto/create-formato.dto';
import { UpdateFormatoDto } from '../dto/update-formato.dto';

@Injectable()
export class FormatosService {
  constructor(
    @InjectRepository(Formato)
    private formatosRepository: Repository<Formato>,
  ) {}

  async create(dto: CreateFormatoDto): Promise<Formato> {
    const formato = this.formatosRepository.create(dto);
    return this.formatosRepository.save(formato);
  }

  async findAll(): Promise<Formato[]> {
    return this.formatosRepository.find();
  }

  async findOne(id: number): Promise<Formato> {
    const formato = await this.formatosRepository.findOne({ where: { id } });
    if (!formato) throw new NotFoundException('Formato não encontrado');
    return formato;
  }

  async update(id: number, dto: UpdateFormatoDto): Promise<Formato> {
    const formato = await this.findOne(id);
    Object.assign(formato, dto);
    return this.formatosRepository.save(formato);
  }

  async remove(id: number): Promise<void> {
    await this.formatosRepository.delete(id);
  }
}
