import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Produto } from '../entities/produto.entity';
import { Fornecedor } from '../entities/fornecedor.entity';

@Entity('tbl_produtos_fornecedores')
export class ProdutoFornecedor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produto, (produto) => produto.produtosFornecedores, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @ManyToOne(
    () => Fornecedor,
    (fornecedor) => fornecedor.produtosFornecedores,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: Fornecedor;

  @Column({ default: true })
  ativo: boolean;
}
