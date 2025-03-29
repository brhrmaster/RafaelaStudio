import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserLogin } from '../../models/models.component';
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
  @Output() showLoading = new EventEmitter<boolean>();

  constructor(private loginService: LoginService) {
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser);
    if(currentUser) {
      this.user = JSON.parse(currentUser);
      this.alterarPaginaAtual.emit('HOME');
    }
  }

  private showLogin(show: boolean) {
    this.showLoading.emit(show);
  }

  efetuarLogin() {
    this.errorMessage = '';

    this.user = {
      login: this.login,
      password: this.password
    };

    this.showLogin(true);

    this.loginService.efetuarLogin(this.user)
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLogin(false);
      }
      if (error.status == 401) {
        this.errorMessage = 'LOGIN INCORRETO';
        this.showLogin(false);
      }
    }))
    .subscribe((loginSuccessData) => {
      if (loginSuccessData) {
        localStorage.setItem('currentUser', JSON.stringify(loginSuccessData));
        this.alterarPaginaAtual.emit('HOME');
        this.showLogin(false);
      }
    });
  }
}
