import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbl_estados')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2 })
  uf: string;

  @Column({ length: 100 })
  nome: string;
}
