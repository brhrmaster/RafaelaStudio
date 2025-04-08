import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Fornecedor, GenericResponse, GetFornecedoresResponse, ResponseData } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private serviceUrl = environment.apiDomain;
  private http: HttpClient = inject(HttpClient);

  async getAll(filtro: string): Promise<GetFornecedoresResponse> {
    return firstValueFrom(this.http.get<GetFornecedoresResponse>(this.getUrlWithPath('fornecedores?filtro=' + filtro)));
  }

  async getById(id: number): Promise<Fornecedor> {
    return firstValueFrom(this.http.get<Fornecedor>(this.getUrlWithPath('fornecedor/' + id)));
  }

  async getAllSimples(produtoId?: number): Promise<GetFornecedoresResponse> {
    return firstValueFrom(this.http.get<GetFornecedoresResponse>(this.getUrlWithPath('fornecedores-simples' + (produtoId ? '/'+produtoId : ''))));
  }

  async createNew(fornecedor: Fornecedor): Promise<ResponseData> {
    return firstValueFrom(this.http.post<ResponseData>(this.getUrlWithPath('fornecedor'), fornecedor));
  }

  async update(fornecedor: Fornecedor): Promise<ResponseData> {
    return firstValueFrom(this.http.put<ResponseData>(this.getUrlWithPath('fornecedor/' + fornecedor.id), fornecedor));
  }

  async deleteById(id?: number): Promise<GenericResponse> {
    return firstValueFrom(this.http.delete<GenericResponse>(this.getUrlWithPath('fornecedor/' + id)));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
