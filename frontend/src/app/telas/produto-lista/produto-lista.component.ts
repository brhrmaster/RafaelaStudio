import { Component, EventEmitter, Output, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, formatDate, registerLocaleData  } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { ProdutoService } from '../../services/produto.service';
import { Fornecedor, GenericResponse, GetFornecedoresResponse, GetProdutosResponse, GetReportsVencimentoData, ModalContent, NavegacaoApp, Produto, ProdutoExpirando } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { FornecedorService } from '../../services/fornecedor.service';
import { ReportsService } from '../../services/reports.service';

registerLocaleData(ptBr);

@Component({
  selector: 'app-produto-lista',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './produto-lista.component.html',
  styleUrls: [
    '../../styles/tela-lista-registros.css',
    './produto-lista.component.css'
  ],
  providers:    [
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    },
  ],
})
export class ProdutoListaComponent extends BaseTelaListagemComponent {
  produtoFiltro: string = '';
  errorMessage: string = '';
  serverResponse: string = '';
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Output() showLoading = new EventEmitter<boolean>();
  private produtoService: ProdutoService = inject(ProdutoService);
  private fornecedorService: FornecedorService = inject(FornecedorService);
  private reportsService: ReportsService = inject(ReportsService);
  produtoSelecionado!: Produto;
  produtosDisponiveis!: Produto[];
  produtosVencendo: ProdutoExpirando[] = [];
  produtosVencidos: ProdutoExpirando[] = [];

  constructor() {
    super();
    this.obterProdutos();
  }

  gotoCadastro() {
    this.alterarPaginaAtual.emit({ nomePagina: 'PRODUTO-FORM', itemId: 0, itemNome: '' });
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async obterProdutos(busca: string = '') {
    this.showLoadingComponent(true);

    try {
      const getProdutosResponse: GetProdutosResponse = await this.produtoService.getAll(busca.trim());
      const getReportsVencimentoData: GetReportsVencimentoData = await this.reportsService.getReportsVencimento();

      if (getProdutosResponse) {
        this.produtosDisponiveis = getProdutosResponse.produtos;
      }

      if (getReportsVencimentoData) {
        this.produtosVencendo = getReportsVencimentoData.produtosVencimento.vencendo;
        this.produtosVencidos = getReportsVencimentoData.produtosVencimento.vencidos;

        for (let i=0; i < this.produtosDisponiveis.length; i++) {
          const currentId = this.produtosDisponiveis[i].id;
          this.produtosDisponiveis[i].vencendo = this.produtosVencendo.find(pv => pv.id === currentId)?.total || 0;
          this.produtosDisponiveis[i].vencidos = this.produtosVencidos.find(pv => pv.id === currentId)?.total || 0;
        }
      }

      this.atualizarListagem();
      this.showLoadingComponent(false);
    } catch (error: any) {
      console.log(error);
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }
  }

  atualizarListagem() {
    this.paginacao.listaModels.update(() => this.produtosDisponiveis);
    this.paginacao.paginaAtual = 1;
    this.setupPaginacao();
  }

  atualizarProduto(id: number) {
    this.alterarPaginaAtual.emit({ nomePagina: 'PRODUTO-FORM', itemId: id, itemNome: '' });
  }

  gerenciarEstoque(produto: Produto) {
    this.produtoSelecionado = produto;
    const botoes = [
      {
        text: 'Registrar Entrada',
        action: 'op-estoque-entrada',
        cssClass: 'btn-primary'
      }
    ];

    if (produto.estoqueTotal > 0) {
      botoes.push({
        text: 'Registrar Saída',
        action: 'op-estoque-saida',
        cssClass: 'btn-success'
      });
    }

    this.openModal({
      title: 'Gerenciar Estoque',
      message: 'Atualizar estoque do produto: <b>'+produto.nome+'</b><br/><br/><b>Qual a operação desejada?</b>',
      cancelButtonText: 'Cancelar',
      cancelButtonClass: 'btn-danger',
      buttons: botoes
    });
  }

  confirmarRemocaoProduto(produto: Produto) {
    this.produtoSelecionado = produto;
    this.openModal({
      title: 'AVISO',
      message: 'Deseja realmente remover este produto? <p><center><b>'+produto.nome+'</b></center></p>',
      cancelButtonText: 'Não',
      cancelButtonClass: 'btn-primary',
      buttons: [
        {
          text: 'Sim',
          action: 'confirm-remove',
          cssClass: 'btn-danger'
        }
      ]
    });
  }

  async modalAction(action: string) {
    this.currentModal.close();

    if (action === 'confirm-remove') {
      this.remocaoProdutoConfirmada();
    }

    if (action === 'op-estoque-entrada') {
      this.alterarPaginaAtual.emit({ nomePagina: 'ENTRADA_SAIDA-FORM', itemId: this.produtoSelecionado.id, itemModo: 1, itemNome: '' });
    }

    if (action === 'op-estoque-saida') {
      this.alterarPaginaAtual.emit({ nomePagina: 'ENTRADA_SAIDA-FORM', itemId: this.produtoSelecionado.id, itemModo: 0, itemNome: '' });
    }
  }

  async remocaoProdutoConfirmada() {
    this.showLoadingComponent(true);

    try {
      const genericResponse: GenericResponse = await this.produtoService.deleteById(this.produtoSelecionado.id);

      if (genericResponse) {
        this.obterProdutos();
        this.showLoadingComponent(false);

        this.openModal({
          title: 'Produto Removido',
          message: 'Produto <b>'+this.produtoSelecionado.nome+'</b> removido com sucesso!',
          cancelButtonText: 'OK',
          cancelButtonClass: 'btn-success'
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }
  }

  async visualizarFornecedores(produto: Produto) {
    this.showLoadingComponent(true);

    try {
      const fornecedoresResponse: GetFornecedoresResponse = await this.fornecedorService.getAllSimples(produto.id);
      this.showLoadingComponent(false);

      if (fornecedoresResponse) {
        const listaFornecedores = fornecedoresResponse.fornecedores;

        let listaFornecedoresHtml = '<div class="fornecedores-selecionados">';

        if (listaFornecedores.length > 0) {
          listaFornecedores.forEach(fornecedor => {
            listaFornecedoresHtml += `<div class="fornecedor-selecionado">${fornecedor.empresa}</div>`;
          });
        } else {
          listaFornecedoresHtml += `<span>Este produto ainda n&atilde;o possui fornecedor vinculado</span>`;
        }

        listaFornecedoresHtml += '</div>';

        this.openModal({
          title: 'Fornecedores do Produto',
          message: `Produto: <b>${produto.nome}</b> <br/><br/> ${listaFornecedoresHtml}`,
          cancelButtonText: 'FECHAR',
          cancelButtonClass: 'btn-primary'
        });

      }
    } catch (error: any) {
      console.log(error);
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }
  }

  ordenarTabela(colunaOrdenar: string, ordem: string) {
    this.produtosDisponiveis.sort(this.compare<Produto>(colunaOrdenar, ordem));
    this.atualizarListagem();
  }

  getListaProdutos() : Produto[] {
    return <Produto[]> this.paginacao.listaModelsPaginados();
  }

  getFormattedDate(datetime: Date) {
    return datetime ? formatDate(datetime, 'dd/MM/yyyy', 'pt-BR') : '';
  }

  executarBuscaOnKeyboard(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = <HTMLInputElement>event.target;
      const value = input.value.trim();
      this.obterProdutos(value);
    }
  }

  executarBuscaOnBlur(event: Event) {
    const input = <HTMLInputElement>event.target;
    const value = input.value.trim();
    this.obterProdutos(value);
  }
}
