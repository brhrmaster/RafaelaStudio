import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin, LoginResponseData, ResponseData, GenericResponse, GetUsuariosResponse, Usuario } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private serviceUrl = environment.apiDomain;

  constructor(private http: HttpClient) {

  }

  efetuarLogin(userLogin: UserLogin): Observable<LoginResponseData> {
    return this.http.post<LoginResponseData>(this.getUrlWithPath('usuario/login'), userLogin);
  }

  getAll(filtro: string): Observable<GetUsuariosResponse> {
    return this.http.get<GetUsuariosResponse>(this.getUrlWithPath('usuarios?filtro=' + filtro));
  }

  deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.getUrlWithPath('usuario/' + id));
  }

  createNew(usuario: Usuario): Observable<ResponseData> {
    console.log('Indo até a API para cadastrar novo produto...');
    return this.http.post<ResponseData>(this.getUrlWithPath('usuario'), usuario);
  }

  getUrlWithPath(path: string): string {
    return this.serviceUrl + path;
  }
}
