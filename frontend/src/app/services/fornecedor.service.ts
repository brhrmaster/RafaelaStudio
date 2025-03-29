import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse, GetFornecedoresResponse } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private serviceUrl = environment.apiDomain;

  constructor(private http: HttpClient) {

  }

  getAll(filtro: string): Observable<GetFornecedoresResponse> {
    return this.http.get<GetFornecedoresResponse>(this.serviceUrl + 'fornecedores?filtro=' + filtro);
  }

  deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.serviceUrl + 'fornecedor/' + id);
  }
}
