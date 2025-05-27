import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavegacaoApp } from '../../models/models.component';

@Component({
  selector: 'app-header-pagina',
  imports: [],
  templateUrl: './header-pagina.component.html',
  styleUrl: './header-pagina.component.css'
})
export class HeaderPaginaComponent {
  paginaAtual: string = '';
  @Input() titulo: string = 'Painel de Controle';
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();

  public alterarPagina(pagina: string) {
    this.paginaAtual = pagina;
    this.alterarPaginaAtual.emit({ nomePagina: pagina, itemId: 0, itemNome: '' });
  }

  public loggout() {
    localStorage.removeItem('currentUser');
    this.alterarPagina('LOGIN');
  }
}
