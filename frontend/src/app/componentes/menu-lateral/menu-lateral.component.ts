import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-lateral',
  imports: [],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent {

  @Output() alterarPaginaAtual = new EventEmitter<string>();

  public alterarPagina(pagina: string) {
    this.alterarPaginaAtual.emit(pagina);
  }

  public loggout() {
    localStorage.removeItem('currentUser');
    this.alterarPagina('LOGIN');
  }
}
