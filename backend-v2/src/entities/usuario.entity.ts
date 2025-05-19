// src/usuarios/entities/usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  GERENTE = 'admin',
  CONTROLADOR = 'controlador',
  VISITANTE = 'visitante',
}

@Entity('tbl_usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VISITANTE })
  role: UserRole;
}
