import { valueOrDefault } from 'chart.js/helpers';
import { Fornecedor, GetProdutoFormatosResponse } from './../../models/models.component';
import { Component, EventEmitter, inject, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto, ProdutoFormato } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { catchError } from 'rxjs';
import { FornecedorService } from '../../services/fornecedor.service';

@Component({
  selector: 'app-produto-form',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './produto-form.component.html',
  styleUrls: [
    '../../styles/tela-form.css',
    './produto-form.component.css'
  ]
})
export class ProdutoFormComponent {

  errorMessage: string = '';
  produtoSelecionado!: Produto;
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  isLoadingVisible: boolean = false;
  productService: ProdutoService = inject(ProdutoService);
  fornecedorService: FornecedorService = inject(FornecedorService);
  produtoFormatos!: ProdutoFormato[];
  fornecedoresDisponiveis!: Fornecedor[];
  fornecedoresSelecionados: Fornecedor[] = [];
  @ViewChild('comboFornecedoresDisponiveis') comboFornecedoresDisponiveis!: ElementRef;

  // TODO: aplicar mascara para valor: https://stackoverflow.com/questions/64364646/creating-directive-in-angular-that-formats-the-value-entered-on-keypress

  constructor() {
    this.obterFormatos();
    this.obterFornecedores();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  incluirFornecedorSelecionado() {
    const fornecedorId = this.comboFornecedoresDisponiveis.nativeElement.value;

    for (let i=0; i < this.fornecedoresDisponiveis.length; i++) {
      if (this.fornecedoresDisponiveis[i].id == fornecedorId) {
        this.fornecedoresSelecionados.push(this.fornecedoresDisponiveis[i]);
        this.fornecedoresDisponiveis.splice(i, 1);
        break;
      }
    }
  }

  removerFornecedorSelecionado(fornecedor: Fornecedor) {
    for (let i=0; i < this.fornecedoresSelecionados.length; i++) {
      if (this.fornecedoresSelecionados[i].id == fornecedor.id) {
        this.fornecedoresDisponiveis.push(this.fornecedoresSelecionados[i]);
        this.fornecedoresSelecionados.splice(i, 1);
        break;
      }
    }
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

  obterFornecedores() {
    this.showLoadingComponent(true);

    this.fornecedorService.getAllSimples()
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((getFornecedoresResponse) => {
      if (getFornecedoresResponse) {
        this.fornecedoresDisponiveis = getFornecedoresResponse.fornecedores;
        this.showLoadingComponent(false);
      }
    });
  }

  cadastrar() {

    // abrindo cortina (ABRIR MODAL)
    console.log('produto cadastrado!');
  }
}
