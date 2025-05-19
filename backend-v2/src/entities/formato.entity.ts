import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbl_formatos')
export class Formato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao?: string;
}
