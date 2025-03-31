export interface Model {
}

export interface Produto extends Model {
  id: number,
  categoryId: number,
  imageLink: string,
  description: string,
  price: number,
  promo: number,
  qtd: number
};

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
  empresa: string,
  nomeRepresentante: string,
  telefone: string,
  email: string,
  endereco: string,
  numero: string,
  cidadeId: number,
  cidadeNome: string,
  estadoNome: string,
  estadoUF: string,
  estadoId: number,
  cep: string,
  site: string
};

export interface Produto extends Model {
  id: number,
  nome: string,
  preco: number,
  isValidadeDefinida: boolean,
  formatoId: number,
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

export interface GetUsuariosResponse {
  users: Usuario[]
};

export interface GenericResponse {
  message: string
};

export interface ModalContent {
  title: string,
  message: string
}

export interface TotalEntradaSaidaProdutoReport {
  dayOfMonth: string,
  tipo: number,
  total: number
}

export interface GetReportsData {
  totalFornecedoresRecentementeCriados: number,
  totalProdutosRecentementeCriados: number,
  totalEntradaSaidaProdutos: TotalEntradaSaidaProdutoReport[]
}
