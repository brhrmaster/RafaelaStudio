import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Formato, GenericResponse, GetFormatosResponse, GetFornecedoresResponse, ResponseData } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormatoService {
  private serviceUrl = environment.apiDomain;
  private http: HttpClient = inject(HttpClient);

  async getAll(filtro: string): Promise<GetFormatosResponse> {
    return firstValueFrom(this.http.get<GetFormatosResponse>(this.getUrlWithPath('produto-formatos?filtro=' + filtro)));
  }

  async getById(id: number): Promise<Formato> {
    return firstValueFrom(this.http.get<Formato>(this.getUrlWithPath('produto-formato/' + id)));
  }

  async createNew(formato: Formato): Promise<ResponseData> {
    return firstValueFrom(this.http.post<ResponseData>(this.getUrlWithPath('produto-formato'), formato));
  }

  async update(formato: Formato): Promise<ResponseData> {
    return firstValueFrom(this.http.put<ResponseData>(this.getUrlWithPath('produto-formato/' + formato.id), formato));
  }

  async deleteById(id?: number): Promise<GenericResponse> {
    return firstValueFrom(this.http.delete<GenericResponse>(this.getUrlWithPath('produto-formato/' + id)));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
