import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produto-lista',
  imports: [
    CommonModule
  ],
  templateUrl: './produto-lista.component.html',
  styles: ''
})
export class ProdutoListaComponent {
  produtos = [];
  produtoSelecionado = {};
}
