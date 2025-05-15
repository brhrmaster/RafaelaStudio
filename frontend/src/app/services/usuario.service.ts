import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserLogin, LoginResponseData, ResponseData, GenericResponse, GetUsuariosResponse, Usuario, UsuarioUpdate } from '../models/models.component';
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

  async getById(id: number): Promise<UsuarioUpdate> {
    return firstValueFrom(this.http.get<UsuarioUpdate>(this.getUrlWithPath('usuario/' + id)));
  }

  async deleteById(id: number): Promise<GenericResponse> {
    return firstValueFrom(this.http.delete<GenericResponse>(this.getUrlWithPath('usuario/' + id)));
  }

  async createNew(usuario: UsuarioUpdate): Promise<ResponseData> {
    return firstValueFrom(this.http.post<ResponseData>(this.getUrlWithPath('usuario'), usuario));
  }

  async update(usuario: UsuarioUpdate): Promise<ResponseData> {
    console.log(usuario);
    return firstValueFrom(this.http.put<ResponseData>(this.getUrlWithPath('usuario/'+usuario.id), usuario));
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
