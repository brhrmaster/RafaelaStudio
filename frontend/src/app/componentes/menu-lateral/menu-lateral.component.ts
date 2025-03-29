import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginResponseData } from '../../models/models.component';

@Component({
  selector: 'app-menu-lateral',
  imports: [],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent {

  user!: LoginResponseData;
  @Output() alterarPaginaAtual = new EventEmitter<string>();

  constructor() {
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }

  public alterarPagina(pagina: string) {
    this.alterarPaginaAtual.emit(pagina);
  }

  public loggout() {
    localStorage.removeItem('currentUser');
    this.alterarPagina('LOGIN');
  }
}
