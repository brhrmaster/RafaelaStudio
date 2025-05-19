import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProdutoFornecedor } from '../entities/produto-fornecedor.entity';
import { Cidade } from './cidade.entity';

@Entity('tbl_fornecedores')
export class Fornecedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  empresa: string;

  @Column({ length: 100 })
  nome_representante: string;

  @Column({ length: 20, nullable: true })
  telefone?: string;

  @Column({ length: 150, nullable: true })
  email?: string;

  @Column({ length: 150, nullable: true })
  endereco?: string;

  @Column({ length: 10, nullable: true })
  numero?: string;

  @ManyToOne(() => Cidade, { eager: true })
  @JoinColumn({ name: 'cidade_id' })
  cidade: Cidade;

  @Column({ length: 10, nullable: true })
  cep?: string;

  @Column({ length: 100, nullable: true })
  site?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => ProdutoFornecedor, (pf) => pf.fornecedor)
  produtosFornecedores: ProdutoFornecedor[];
}
