import { Component, EventEmitter, Output, DEFAULT_CURRENCY_CODE, LOCALE_ID, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule, formatDate, formatCurrency, registerLocaleData  } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { catchError } from 'rxjs';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { ProdutoService } from '../../services/produto.service';
import { GenericResponse, GetProdutosResponse, ModalContent, Produto } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../componentes/modal/modal-generic/modal-generic.component';

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
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();
  private modalService = inject(NgbModal);
  private currentModal!: NgbModalRef;
  produtoService: ProdutoService = inject(ProdutoService);
  produtoSelecionado!: Produto;

  constructor() {
    super();
    this.obterProdutos();
  }

  gotoCadastro() {
    this.alterarPaginaAtual.emit('PRODUTO-FORM');
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

    this.showLoadingComponent(true);

    // chamar tela fornecedor-form para atualizar com base no ID
    console.log('abrir tela produto-form com o id ' + id);
  }

  gerenciarEstoque(produto: Produto) {
    this.produtoSelecionado = produto;
    this.openModal({
      title: 'Gerenciar Estoque',
      message: 'Atualizar estoque do produto: <b>'+this.produtoSelecionado.nome+'</b><br/><br/><b>Qual a operação desejada?</b>',
      cancelButtonText: 'Cancelar',
      cancelButtonClass: 'btn-danger',
      buttons: [
        {
          text: 'Registrar Entrada',
          action: 'op-estoque-entrada',
          cssClass: 'btn-primary'
        },
        {
          text: 'Registrar Saída',
          action: 'op-estoque-saida',
          cssClass: 'btn-success'
        }
      ]
    });
  }

  confirmarRemocaoProduto(produto: Produto) {
    this.produtoSelecionado = produto;
    this.openModal({
      title: 'AVISO',
      message: 'Deseja realmente remover este produto? <p><center><b>'+this.produtoSelecionado.nome+'</b></center></p>',
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
      console.log('navegar para o registro de estoque - entrada');
    }

    if (action === 'op-estoque-saida') {
      console.log('navegar para o registro de estoque - saída');
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
