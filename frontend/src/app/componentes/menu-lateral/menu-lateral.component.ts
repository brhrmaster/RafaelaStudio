import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginResponseData, NavegacaoApp } from '../../models/models.component';
import { BaseTela } from '../BaseTela';

@Component({
  selector: 'app-menu-lateral',
  imports: [CommonModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent extends BaseTela {

  protected override modalAction(action: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  paginaAtual: string = '';
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();

  constructor() {
    super();
  }

  public alterarPagina(pagina: string) {
    this.paginaAtual = pagina;
    this.alterarPaginaAtual.emit({ nomePagina: pagina, itemId: 0});
  }

  public loggout() {
    localStorage.removeItem('currentUser');
    this.alterarPagina('LOGIN');
  }
}
