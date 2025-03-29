import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-lista',
  imports: [
    CommonModule
  ],
  templateUrl: './usuario-lista.component.html',
  styles: ''
})
export class UsuarioListaComponent {
  usuarios = [];
  usuarioSelecionado = {};
  @Output() showLoading = new EventEmitter<boolean>();

  private showLogin(show: boolean) {
    this.showLoading.emit(show);
  }

}
