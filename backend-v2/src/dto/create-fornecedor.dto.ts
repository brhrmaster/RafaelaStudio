export class CreateFornecedorDto {
  empresa: string;
  nome_representante: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  cidadeId: number;
  cep?: string;
  site?: string;
  produtoIds?: number[];
}
