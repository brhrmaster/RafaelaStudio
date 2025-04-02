import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { CommonModule, formatDate  } from '@angular/common';
import { catchError } from 'rxjs';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { EstoqueService } from '../../services/estoque.service';
import { AtividadeEstoque } from '../../models/models.component';
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
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @ViewChild('txtbusca') txtBusca!: ElementRef;
  estoqueService: EstoqueService = inject(EstoqueService);

  constructor() {
    super();
    this.obterEntradasSaidas();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  obterEntradasSaidas(busca: string = '') {
    this.showLoadingComponent(true);

    this.estoqueService.getAll(busca.trim())
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((getEstoqueResponse) => {
      if (getEstoqueResponse) {
        this.paginacao.listaModels = getEstoqueResponse.atividadesEstoque;

        console.log(this.paginacao.listaModels);
        this.setupPaginacao();
        this.showLoadingComponent(false);
      }
    });
  }

  getListaEntradasSaidas() : AtividadeEstoque[] {
    return <AtividadeEstoque[]> this.paginacao.listaModelsPaginados;
  }

  getFormattedDate(datetime: Date, format: string) {
    return datetime ? formatDate(datetime, format, 'pt-BR') : '';
  }

  executarBusca(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = <HTMLInputElement>event.target;
      this.obterEntradasSaidas(input.value);
    }
  }
}
