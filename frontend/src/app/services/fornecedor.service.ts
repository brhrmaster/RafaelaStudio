import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fornecedor, GenericResponse, GetFornecedoresResponse, ResponseData } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private serviceUrl = environment.apiDomain;

  constructor(private http: HttpClient) {

  }

  getAll(filtro: string): Observable<GetFornecedoresResponse> {
    return this.http.get<GetFornecedoresResponse>(this.getUrlWithPath('fornecedores?filtro=' + filtro));
  }

  getAllSimples(): Observable<GetFornecedoresResponse> {
    return this.http.get<GetFornecedoresResponse>(this.getUrlWithPath('fornecedores-simples'));
  }

  createNew(fornecedor: Fornecedor): Observable<ResponseData> {
    console.log('Indo até a API para cadastrar novo produto...');
    return this.http.post<ResponseData>(this.getUrlWithPath('fornecedor'), fornecedor);
  }

  deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.getUrlWithPath('fornecedor/' + id));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
