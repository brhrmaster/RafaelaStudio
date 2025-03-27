import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin, LoginResponseData } from '../models/models.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private serviceUrl = environment.apiDomain + 'usuario/login';

  constructor(private http: HttpClient) {

  }

  efetuarLogin(userLogin: UserLogin): Observable<LoginResponseData> {
    return this.http.post<LoginResponseData>(this.serviceUrl, userLogin);
  }
}
