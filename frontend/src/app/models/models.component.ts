export interface NavegacaoApp {
  nomePagina: string,
  itemId: number
}

export interface Model {
}

export interface Usuario extends Model {
  id: number,
  nome: string,
  login: string
};

export interface UserLogin extends Model {
  login: string,
  password: string
};

export interface ResponseData {}

export interface LoginResponseData {
  id: number,
  nome: number,
  login: number,
};

export interface Fornecedor extends Model {
  id: number,
  empresa?: string,
  nomeRepresentante?: string,
  telefone?: string,
  email?: string,
  endereco?: string,
  numero?: string,
  cidadeId?: number,
  cidadeNome?: string,
  estadoNome?: string,
  estadoUF?: string,
  estadoId?: number,
  cep?: string,
  site?: string
};

export interface ProdutoInsert extends Model {
  id: number,
  nome?: string,
  preco?: number,
  isValidadeDefinida?: boolean,
  formatoId?: number,
  fornecedores: number[]
};

export interface Produto extends ProdutoInsert {
  id: number,
  formatoNome: string,
  estoqueTotal: number,
  estoqueCursos: number,
  estoqueClientes: number,
  validade: Date
};

export interface GetFornecedoresResponse {
  fornecedores: Fornecedor[]
};

export interface GetProdutosResponse {
  produtos: Produto[]
};

export interface ProdutoFormato {
  id: number,
  nome: string
}

export interface GetProdutoFormatosResponse {
  produtoFormatos: ProdutoFormato[]
};

export interface GetUsuariosResponse {
  users: Usuario[]
};

export interface GenericResponse {
  message: string
};

export interface ModalButton {
  text: string,
  action: string,
  cssClass: string
}

export interface ModalContent {
  title: string,
  message: string,
  cancelButtonText: string,
  cancelButtonClass: string,
  buttons?: ModalButton[]
}

export interface TotalEntradaSaidaProdutoReport {
  dayOfMonth: string,
  tipo: number,
  total: number
}

export interface TotalProdutosPorFornecedor {
  empresa: string,
  totalProdutos: number,
}

export interface GetReportsData {
  totalFornecedoresRecentementeCriados: number,
  totalProdutosRecentementeCriados: number,
  totalProdutosPorFornecedor: TotalProdutosPorFornecedor[],
  totalEntradaSaidaProdutos: TotalEntradaSaidaProdutoReport[]
}

export interface AtividadeEstoque {
  tipo: number,
  tipoNome: string,
  total: number,
  validade: Date,
  qtdClientes: number,
  qtdCursos: number,
  produtoId: number,
  produtoNome: string,
  isValidadeDefinida: boolean,
  createdAt: Date
}

export interface GetAtividadesEstoque {
  atividadesEstoque: AtividadeEstoque[]
}


export interface Estado {
  id: number,
  nome: string,
  uf: string
}

export interface EstadoResponse {
  estados: Estado[]
}

export interface Cidade {
  id: number,
  nome: string,
  estado_id: number
}

export interface CidadeResponse {
  cidades: Cidade[]
}
