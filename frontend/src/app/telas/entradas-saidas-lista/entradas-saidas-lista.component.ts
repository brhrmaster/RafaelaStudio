import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild, OnInit } from '@angular/core';
import { CommonModule, formatDate  } from '@angular/common';
import { catchError } from 'rxjs';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { EstoqueService } from '../../services/estoque.service';
import { AtividadeEstoque, GetAtividadesEstoque, NavegacaoApp } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";

@Component({
  selector: 'app-entradas-saidas-lista',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './entradas-saidas-lista.component.html',
  styleUrls: [
    '../../styles/tela-lista-registros.css',
    './entradas-saidas-lista.component.css',
  ],
})
export class EntradaSaidaListaComponent extends BaseTelaListagemComponent {
  produtoFiltro: string = '';
  errorMessage: string = '';
  serverResponse: string = '';
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Input() itemNome!: string;
  estoqueService: EstoqueService = inject(EstoqueService);

  constructor() {
    super(20);
  }

  async ngOnChanges() {
    this.obterEntradasSaidas(this.itemNome);
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async obterEntradasSaidas(busca: string = '') {
    this.showLoadingComponent(true);

    try {
      const getAtividadesEstoque: GetAtividadesEstoque = await this.estoqueService.getAll(busca.trim());

      if (getAtividadesEstoque) {
        this.paginacao.listaModels.update(() => getAtividadesEstoque.atividadesEstoque);
        this.paginacao.paginaAtual = 1;
        this.setupPaginacao();
        this.showLoadingComponent(false);
      }
    } catch (error: any) {
      console.log(error);
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }
  }

  async modalAction(action: string) {
  }

  getListaEntradasSaidas() : AtividadeEstoque[] {
    return <AtividadeEstoque[]> this.paginacao.listaModelsPaginados();
  }

  getFormattedDate(datetime: Date, format: string) {
    return datetime ? formatDate(datetime, format, 'pt-BR') : '';
  }

  executarBuscaOnKeyboard(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = <HTMLInputElement>event.target;
      const value = input.value.trim();
      this.obterEntradasSaidas(value);
    }
  }

  executarBuscaOnBlur(event: Event) {
    const input = <HTMLInputElement>event.target;
    const value = input.value.trim();
    this.obterEntradasSaidas(value);
  }
}
