import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ResponseData } from '../models/models.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private serviceUrl = 'http://localhost:3000/api/produtos/';

  constructor(private http: HttpClient) {

  }

  getById(id: number): Observable<ResponseData> {
    return this.http.get<ResponseData>(this.getUrlWithPath(String(id)));
  }

  getAll(): Observable<ResponseData> {
    return this.http.get<ResponseData>(this.getUrlWithPath(''));
  }

  createNew(product: Product): Observable<ResponseData> {
    console.log('Indo até a API para cadastrar novo produto...');
    return this.http.post<ResponseData>(this.getUrlWithPath(''), product);
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
