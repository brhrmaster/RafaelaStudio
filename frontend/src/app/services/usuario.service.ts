import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserLogin, LoginResponseData, ResponseData, GenericResponse, GetUsuariosResponse, Usuario } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private serviceUrl = environment.apiDomain;
  private http: HttpClient = inject(HttpClient);

  async efetuarLogin(userLogin: UserLogin): Promise<LoginResponseData> {
    return firstValueFrom(this.http.post<LoginResponseData>(this.getUrlWithPath('usuario/login'), userLogin));
  }

  async getAll(filtro: string): Promise<GetUsuariosResponse> {
    return firstValueFrom(this.http.get<GetUsuariosResponse>(this.getUrlWithPath('usuarios?filtro=' + filtro)));
  }

  async deleteById(id: number): Promise<GenericResponse> {
    return firstValueFrom(this.http.delete<GenericResponse>(this.getUrlWithPath('usuario/' + id)));
  }

  async createNew(usuario: Usuario): Promise<ResponseData> {
    console.log('Indo até a API para cadastrar novo produto...');
    return firstValueFrom(this.http.post<ResponseData>(this.getUrlWithPath('usuario'), usuario));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
