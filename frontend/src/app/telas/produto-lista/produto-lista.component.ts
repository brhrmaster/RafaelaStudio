import { Component, EventEmitter, Output, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, formatDate, registerLocaleData  } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { ProdutoService } from '../../services/produto.service';
import { Fornecedor, GenericResponse, GetFornecedoresResponse, GetProdutosResponse, ModalContent, NavegacaoApp, Produto } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../componentes/modal/modal-generic/modal-generic.component';
import { FornecedorService } from '../../services/fornecedor.service';

registerLocaleData(ptBr);

@Component({
  selector: 'app-produto-lista',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './produto-lista.component.html',
  styleUrls: [
    '../../styles/tela-lista-registros.css'
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
  private modalService = inject(NgbModal);
  private currentModal!: NgbModalRef;
  private produtoService: ProdutoService = inject(ProdutoService);
  private fornecedorService: FornecedorService = inject(FornecedorService);
  produtoSelecionado!: Produto;

  constructor() {
    super();
    this.obterProdutos();
  }

  gotoCadastro() {
    this.alterarPaginaAtual.emit({ nomePagina: 'PRODUTO-FORM', itemId: 0});
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async obterProdutos(busca: string = '') {
    this.showLoadingComponent(true);

    try {
      const getProdutosResponse: GetProdutosResponse = await this.produtoService.getAll(busca.trim());

      if (getProdutosResponse) {
        this.paginacao.listaModels.update(() => getProdutosResponse.produtos);
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

  atualizarProduto(id: number) {
    this.alterarPaginaAtual.emit({ nomePagina: 'PRODUTO-FORM', itemId: id });
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

  openModal(modalContent: ModalContent) {
    this.currentModal = this.modalService.open(ModalComponent);
    this.currentModal.componentInstance.modalContent = modalContent;
    this.currentModal.componentInstance.onModalAction.subscribe(async (action:string) => await this.modalAction(action));
  }

  async modalAction(action: string) {
    this.currentModal.close();

    if (action === 'confirm-remove') {
      this.remocaoProdutoConfirmada();
    }

    if (action === 'op-estoque-entrada') {
      this.alterarPaginaAtual.emit({ nomePagina: 'ENTRADA_SAIDA-FORM', itemId: this.produtoSelecionado.id, itemModo: 1});
    }

    if (action === 'op-estoque-saida') {
      this.alterarPaginaAtual.emit({ nomePagina: 'ENTRADA_SAIDA-FORM', itemId: this.produtoSelecionado.id, itemModo: 0});
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
