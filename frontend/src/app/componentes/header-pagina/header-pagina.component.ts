import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-pagina',
  imports: [],
  templateUrl: './header-pagina.component.html',
  styleUrl: './header-pagina.component.css'
})
export class HeaderPaginaComponent {
  @Input() titulo: string = 'Painel de Controle';
}
