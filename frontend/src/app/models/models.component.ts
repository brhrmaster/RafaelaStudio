export interface Model {
}

export interface Product extends Model {
  id: number,
  categoryId: number,
  imageLink: string,
  description: string,
  price: number,
  promo: number,
  qtd: number
};

export interface User extends Model {
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

export interface GetFornecedoresResponse {
  fornecedores: Fornecedor[]
};

export interface GenericResponse {
  message: string
};


export interface ModalContent {
  title: string,
  message: string
}
