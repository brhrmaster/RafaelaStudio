import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseData } from '../models/models.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private serviceUrl = 'resource-url/';

  constructor(private http: HttpClient) {

  }

  getById(id: number): Observable<ResponseData> {
    return this.http.get<ResponseData>(this.getUrlWithPath(String(id)));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
