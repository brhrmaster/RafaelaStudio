import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../componentes/loading/loading.component";

@Component({
  selector: 'app-usuario-form',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './usuario-form.component.html',
  styles: ''
})
export class UsuarioFormComponent {
  usuarioSelecionado = {};
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

}
