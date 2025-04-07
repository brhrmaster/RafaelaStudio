import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit, inject } from '@angular/core';
import { LoginResponseData, UserLogin } from '../../models/models.component';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../componentes/loading/loading.component";


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  protected user!: UserLogin;
  protected login: string = '';
  protected password: string = '';
  protected errorMessage: string = '';
  protected isLoadingVisible: boolean = false;

  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  @ViewChild('txtusuario') txtUsuario!: ElementRef;
  @ViewChild('txtpassword') txtPassword!: ElementRef;

  private usuarioService: UsuarioService = inject(UsuarioService);

  OnInit() {
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser);
    if(currentUser) {
      this.user = JSON.parse(currentUser);
      this.alterarPaginaAtual.emit('HOME');
    }
  }

  ngAfterViewInit() {
    this.txtUsuario.nativeElement.focus();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async efetuarLogin() {
    this.errorMessage = '';

    this.user = {
      login: this.login,
      password: this.password
    };

    this.showLoadingComponent(true);

    try {
      const loginSuccessData: LoginResponseData = await this.usuarioService.efetuarLogin(this.user);

      if (loginSuccessData) {
        localStorage.setItem('currentUser', JSON.stringify(loginSuccessData));
        this.showLoadingComponent(false);
        this.alterarPaginaAtual.emit('HOME');
      }
    } catch (error: any) {
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
      if (error.status == 401) {
        this.errorMessage = 'LOGIN INCORRETO';
        this.showLoadingComponent(false);
      }
    }
  }

  prepareSendingLogin(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = <HTMLInputElement>event.target;
      if (input.name === 'usuario') this.txtPassword.nativeElement.focus();
      if (input.name === 'password' || input.name === 'btnLogin') this.efetuarLogin();
    }
  }
}
