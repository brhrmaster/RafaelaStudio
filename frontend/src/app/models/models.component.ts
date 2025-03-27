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

export interface Category extends Model {
};

export interface User extends Model {
};

export interface UserLogin extends Model {
  login: string,
  password: string
};

export interface LoginResponseData {
  id: number,
  nome: number,
  login: number,
};

export interface ResponseData {
  categories: Category[],
  products: Product[],
};

export interface RequestData {
  id: number

};

export interface ModalContent {
  title: string,
  message: string
}
