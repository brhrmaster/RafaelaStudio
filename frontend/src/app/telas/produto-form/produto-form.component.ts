import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";

@Component({
  selector: 'app-produto-form',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './produto-form.component.html',
  styles: ''
})
export class ProdutoFormComponent {

  errorMessage: string = '';
  produtoSelecionado!: Produto;
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  isLoadingVisible: boolean = false;
  productService: ProdutoService = inject(ProdutoService);


  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  cadastrar() {

    // abrindo cortina (ABRIR MODAL)
    console.log('produto cadastrado!');
  }
}
