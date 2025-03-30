import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-form',
  imports: [
    CommonModule,
  ],
  templateUrl: './usuario-form.component.html',
  styles: ''
})
export class UsuarioFormComponent {
  usuarioSelecionado = {};
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  private showLoadingComponent(show: boolean) {
    this.showLoading.emit(show);
  }

}
