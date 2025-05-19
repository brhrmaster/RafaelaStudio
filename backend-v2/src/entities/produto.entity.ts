import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProdutoFornecedor } from '../entities/produto-fornecedor.entity';
import { Formato } from '../entities/formato.entity';

@Entity('tbl_produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  preco?: number;

  @OneToMany(() => ProdutoFornecedor, (pf) => pf.produto)
  produtosFornecedores: ProdutoFornecedor[];

  @ManyToOne(() => Formato, { eager: true, nullable: true })
  @JoinColumn({ name: 'formato_id' })
  formato: Formato;
}
