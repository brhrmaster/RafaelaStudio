import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GetReportsData, GetReportsVencimentoData } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private serviceUrl = environment.apiDomain;
  private http: HttpClient = inject(HttpClient);

  async getReports(): Promise<GetReportsData> {
    return firstValueFrom(this.http.get<GetReportsData>(this.getUrlWithPath('reports')));
  }

  async getReportsVencimento(): Promise<GetReportsVencimentoData> {
    return firstValueFrom(this.http.get<GetReportsVencimentoData>(this.getUrlWithPath('reports-vencimento')));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
