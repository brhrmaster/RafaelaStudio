export class CreateProdutoEstoqueDto {
  tipo: number; // 1=ENTRADA, 0=SAIDA
  produtoId: number;
  total: number;
  validade?: string; // YYYY-MM-DD
  qtd_clientes: number;
  qtd_cursos: number;
}
