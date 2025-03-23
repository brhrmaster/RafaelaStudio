export interface Model {
  id: number,
  name: string
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

export interface ResponseData {
  categories: Category[],
  products: Product[],
};

export interface RequestData {
  id: number
};
