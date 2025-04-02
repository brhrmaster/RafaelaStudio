import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../componentes/loading/loading.component";

@Component({
  selector: 'app-fornecedor-form',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './fornecedor-form.component.html',
  styles: ''
})
export class FornecedorFormComponent {
  fornecedorSelecionado = {};
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<string>();

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

}
