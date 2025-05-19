import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const user = this.usuarioRepository.create(dto);
    user.password = await bcrypt.hash(dto.password, 10);
    return this.usuarioRepository.save(user);
  }

  async findByLogin(login: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { login } });
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }
}
