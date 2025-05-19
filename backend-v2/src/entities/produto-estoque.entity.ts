import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Produto } from '../entities/produto.entity';

@Entity('tbl_produto_estoque')
export class ProdutoEstoque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('tinyint')
  tipo: number; // 1=ENTRADA, 0=SAIDA

  @ManyToOne(() => Produto, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column('int')
  total: number;

  @Column({ type: 'date', nullable: true })
  validade?: Date | null;

  @Column('int')
  qtd_clientes: number;

  @Column('int')
  qtd_cursos: number;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
