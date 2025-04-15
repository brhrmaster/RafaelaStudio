import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AtividadeEstoque, GetAtividadesEstoque, ResponseData } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  private serviceUrl = environment.apiDomain;
  private http: HttpClient = inject(HttpClient);

  async getAll(filtro: string): Promise<GetAtividadesEstoque> {
    return firstValueFrom(this.http.get<GetAtividadesEstoque>(this.getUrlWithPath('produto-estoque?produto=' + filtro)));
  }

  async save(atividadeEstoque: AtividadeEstoque): Promise<ResponseData> {
    return firstValueFrom(this.http.post<ResponseData>(this.getUrlWithPath('produto-estoque/' + atividadeEstoque.produtoId), atividadeEstoque));
  }

  async getAllByProdutoId(produtoId: number): Promise<GetAtividadesEstoque> {
    return firstValueFrom(this.http.get<GetAtividadesEstoque>(this.getUrlWithPath('produto-estoque?produtoId=' + produtoId)));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
