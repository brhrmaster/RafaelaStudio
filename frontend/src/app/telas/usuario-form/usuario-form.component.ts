import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { NavegacaoApp } from '../../models/models.component';

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
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Input({ required: true }) itemId!: number;

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

}
