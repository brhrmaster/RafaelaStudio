import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fornecedor-lista',
  imports: [
    CommonModule
  ],
  templateUrl: './fornecedor-lista.component.html',
  styles: ''
})
export class FornecedorListaComponent {
  fornecedores = [];
  formecedorSelecionado = {};
}
