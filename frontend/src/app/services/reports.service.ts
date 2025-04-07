import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GetReportsData } from '../models/models.component';
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

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
