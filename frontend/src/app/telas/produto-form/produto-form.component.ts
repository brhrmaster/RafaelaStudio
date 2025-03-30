import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/models.component';

@Component({
  selector: 'app-produto-form',
  imports: [
    CommonModule,
  ],
  templateUrl: './produto-form.component.html',
  styles: ''
})
export class ProdutoFormComponent {

  produtoSelecionado!: Produto;
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  constructor(private produtoService: ProdutoService) {

  }

  private showLoadingComponent(show: boolean) {
    this.showLoading.emit(show);
  }

  cadastrar() {

    // abrindo cortina (ABRIR MODAL)
    console.log('produto cadastrado!');
  }
}
