import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GetAtividadesEstoque } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  private serviceUrl = environment.apiDomain;
  private http: HttpClient = inject(HttpClient);

  async getAll(filtro: string): Promise<GetAtividadesEstoque> {
    return firstValueFrom(this.http.get<GetAtividadesEstoque>(this.getUrlWithPath('produto/estoque?produto=' + filtro)));
  }

  async getAllByProdutoId(produtoId: number): Promise<GetAtividadesEstoque> {
    return firstValueFrom(this.http.get<GetAtividadesEstoque>(this.getUrlWithPath('produto/estoque?produtoId=' + produtoId)));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
