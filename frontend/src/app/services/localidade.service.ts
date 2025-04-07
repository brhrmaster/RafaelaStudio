import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CidadeResponse, EstadoResponse } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalidadeService {

  private serviceUrl = environment.apiDomain;
  private http: HttpClient = inject(HttpClient);

  async getEstados(): Promise<EstadoResponse> {
    return firstValueFrom(this.http.get<EstadoResponse>(this.getUrlWithPath('estados')));
  }

  async getCidades(estadoId: number): Promise<CidadeResponse> {
    return firstValueFrom(this.http.get<CidadeResponse>(this.getUrlWithPath('cidades/' + estadoId)));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
