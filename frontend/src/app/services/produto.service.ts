import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse, GetProdutoFormatosResponse, GetProdutosResponse, Produto, ResponseData } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private serviceUrl = environment.apiDomain;

  constructor(private http: HttpClient) {

  }

  getAll(filtro: string): Observable<GetProdutosResponse> {
    return this.http.get<GetProdutosResponse>(this.getUrlWithPath('produtos?filtro=' + filtro));
  }

  deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.getUrlWithPath('produto/' + id));
  }

  createNew(produto: Produto): Observable<ResponseData> {
    console.log('Indo até a API para cadastrar novo produto...');
    return this.http.post<ResponseData>(this.getUrlWithPath('produto'), produto);
  }

  getFormatos() {
    return this.http.get<GetProdutoFormatosResponse>(this.getUrlWithPath('produto/formatos'));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
