import { Component, EventEmitter, Output, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, formatDate, registerLocaleData  } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { GetReportsVencimentoData, NavegacaoApp, Produto, ProdutoExpirando } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { ReportsService } from '../../services/reports.service';

registerLocaleData(ptBr);

@Component({
  selector: 'app-gestao-validade-lista',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './gestao-validade-lista.component.html',
  styleUrls: [
    '../../styles/tela-lista-registros.css',
    './gestao-validade-lista.component.css'
  ],
  providers:    [
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    },
  ],
})
export class GestaoValidadeListaComponent extends BaseTelaListagemComponent {
  produtoFiltro: string = '';
  errorMessage: string = '';
  serverResponse: string = '';
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Output() showLoading = new EventEmitter<boolean>();
  private reportsService: ReportsService = inject(ReportsService);
  produtosVencendo: ProdutoExpirando[] = [];
  produtosVencidos: ProdutoExpirando[] = [];
  produtoSelecionado!: Produto;

  constructor() {
    super();
    this.obterDadosVencimento();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async obterDadosVencimento(busca: string = '') {
    this.showLoadingComponent(true);

    try {
      const getReportsVencimentoData: GetReportsVencimentoData = await this.reportsService.getReportsVencimento();

      if (getReportsVencimentoData) {
        this.produtosVencendo = getReportsVencimentoData.produtosVencimento.vencendo;
        this.produtosVencidos = getReportsVencimentoData.produtosVencimento.vencidos;
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

  ordenarTabela(tabela: string, colunaOrdenar: string, ordem: string) {
    if (tabela === 'vencendo') {
      this.produtosVencendo.sort(this.compare<ProdutoExpirando>(colunaOrdenar, ordem));
    }

    if (tabela === 'vencidos') {
      this.produtosVencidos.sort(this.compare<ProdutoExpirando>(colunaOrdenar, ordem));
    }
  }

  getFormattedDate(datetime: Date) {
    return datetime ? formatDate(datetime, 'dd/MM/yyyy', 'pt-BR') : '';
  }

  executarBuscaOnKeyboard(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = <HTMLInputElement>event.target;
      const value = input.value.trim();
      // this.obterProdutos(value);
    }
  }

  executarBuscaOnBlur(event: Event) {
    const input = <HTMLInputElement>event.target;
    const value = input.value.trim();
    // this.obterProdutos(value);
  }

  viewHistory(produto: ProdutoExpirando) {
    console.log(produto);
    this.alterarPaginaAtual.emit({ nomePagina: 'ENTRADA_SAIDA', itemId: produto.id, itemNome: produto.nome });
  }
}
