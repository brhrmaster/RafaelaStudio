import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserLogin, LoginResponseData } from '../../models/models.component';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user!: UserLogin;
  login: string = '';
  password: string = '';
  errorMessage: string = '';

  @Output() alterarPaginaAtual = new EventEmitter<string>();

  constructor(private loginService: LoginService) {
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser);
    if(currentUser) {
      this.user = JSON.parse(currentUser);
      this.alterarPaginaAtual.emit('HOME');
    }
  }

  efetuarLogin() {
    this.errorMessage = '';

    this.user = {
      login: this.login,
      password: this.password
    };

    this.loginService.efetuarLogin(this.user)
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
      }
      if (error.status == 401) {
        this.errorMessage = 'LOGIN INCORRETO';
      }
    }))
    .subscribe((loginSuccessData) => {
      if (loginSuccessData) {
        localStorage.setItem('currentUser', JSON.stringify(loginSuccessData));
        this.alterarPaginaAtual.emit('HOME');
      }
    });

  }
}
