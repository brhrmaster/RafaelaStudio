import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAtividadesEstoque } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  private serviceUrl = environment.apiDomain;

  constructor(private http: HttpClient) {}

  getAll(filtro: string): Observable<GetAtividadesEstoque> {
    return this.http.get<GetAtividadesEstoque>(this.getUrlWithPath('produto/estoque?produto=' + filtro));
  }

  getAllByProdutoId(produtoId: number): Observable<GetAtividadesEstoque> {
    return this.http.get<GetAtividadesEstoque>(this.getUrlWithPath('produto/estoque?produtoId=' + produtoId));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
