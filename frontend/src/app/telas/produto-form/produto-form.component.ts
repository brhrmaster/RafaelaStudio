import { GetProdutoFormatosResponse } from './../../models/models.component';
import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto, ProdutoFormato } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { catchError } from 'rxjs';

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
  produtoFormatos!: ProdutoFormato[];

  constructor() {
    this.obterFormatos();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  obterFormatos() {
    this.showLoadingComponent(true);

    this.productService.getFormatos()
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((getProdutoFormatosResponse) => {
      if (getProdutoFormatosResponse) {
        this.produtoFormatos = getProdutoFormatosResponse.produtoFormatos;
        this.showLoadingComponent(false);
      }
    });
  }

  cadastrar() {

    // abrindo cortina (ABRIR MODAL)
    console.log('produto cadastrado!');
  }
}
