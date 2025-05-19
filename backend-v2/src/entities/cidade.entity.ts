import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estado } from './estado.entity';

@Entity('tbl_cidades')
export class Cidade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  nome: string;

  @ManyToOne(() => Estado, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;
}
