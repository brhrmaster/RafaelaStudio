import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(private dataSource: DataSource) {}

  async getReports() {
    // 1. Total fornecedores cadastrados no último mês
    const [{ total: totalFornecedoresRecentementeCriados } = { total: 0 }] =
      await this.dataSource.query(`
        SELECT COUNT(0) AS total
        FROM tbl_fornecedores
        WHERE created_at >= (NOW() - INTERVAL 1 MONTH)
      `);

    // 2. Total produtos cadastrados no último mês
    const [{ total: totalProdutosRecentementeCriados } = { total: 0 }] =
      await this.dataSource.query(`
        SELECT COUNT(0) AS total
        FROM tbl_produtos
        WHERE created_at >= (NOW() - INTERVAL 1 MONTH)
      `);

    // 3. Fornecedores e total de produtos relacionados
    const totalProdutosPorFornecedor = await this.dataSource.query(`
        SELECT 
          f.empresa,
          (SELECT COUNT(0) FROM tbl_produto_fornecedor WHERE fornecedor_id = f.id) AS totalProdutos
        FROM tbl_fornecedores f
        WHERE (SELECT COUNT(0) FROM tbl_produto_fornecedor WHERE fornecedor_id = f.id) > 0
        ORDER BY totalProdutos DESC
      `);

    // 4. Entradas e saídas de estoque (último mês)
    const totalEntradaSaidaProdutos = await this.dataSource.query(`
        SELECT 
          DATE_FORMAT(created_at, "%Y-%m-%d") AS dayOfMonth,
          tipo,
          CAST(SUM(total) AS UNSIGNED) AS total
        FROM tbl_produto_estoque
        WHERE created_at >= (NOW() - INTERVAL 1 MONTH)
        GROUP BY dayOfMonth, tipo
        ORDER BY dayOfMonth
      `);

    // 5. Produtos com vencimento próximo
    const produtosEmVencimento = await this.dataSource.query(`
        SELECT 
          p.id,
          p.nome,
          e.validade,
          e.total,
          DATEDIFF(e.validade, NOW()) AS dias_restantes
        FROM tbl_produtos p
        JOIN tbl_produto_estoque e ON p.id = e.produto_id
        WHERE e.tipo = 1
          AND e.validade IS NOT NULL
          AND DATEDIFF(e.validade, NOW()) <= 45
        ORDER BY e.validade ASC
      `);

    return {
      totalFornecedoresRecentementeCriados: Number(
        totalFornecedoresRecentementeCriados,
      ),
      totalProdutosRecentementeCriados: Number(
        totalProdutosRecentementeCriados,
      ),
      totalProdutosPorFornecedor,
      totalEntradaSaidaProdutos,
      produtosEmVencimento,
    };
  }
}
