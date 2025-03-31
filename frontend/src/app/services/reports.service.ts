import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetReportsData } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private serviceUrl = environment.apiDomain;

  constructor(private http: HttpClient) {

  }

  getReports(): Observable<GetReportsData> {
    return this.http.get<GetReportsData>(this.getUrlWithPath('reports'));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
