import { Component, ElementRef, EventEmitter, inject, Output, Type, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FornecedorService } from '../../services/fornecedor.service';
import { Fornecedor, GenericResponse, GetFornecedoresResponse, ModalContent, NavegacaoApp } from '../../models/models.component';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { LoadingComponent } from "../../componentes/loading/loading.component";

@Component({
  selector: 'app-fornecedor-lista',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './fornecedor-lista.component.html',
  styleUrls: [
    '../../styles/tela-lista-registros.css'
  ]
})
export class FornecedorListaComponent extends BaseTelaListagemComponent {
  errorMessage: string = '';
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  private fornecedorService: FornecedorService = inject(FornecedorService);
  fornecedorSelecionado!: Fornecedor;
  fornecedoresDisponiveis!: Fornecedor[];

  constructor() {
    super();
    this.obterFornecedores();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async obterFornecedores(busca: string = '') {
    this.showLoadingComponent(true);

    try {
      const fornecedoresResponse: GetFornecedoresResponse = await this.fornecedorService.getAll(busca.trim());

      if (fornecedoresResponse) {
        this.fornecedoresDisponiveis = fornecedoresResponse.fornecedores;
        this.atualizarListagem();
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

  atualizarListagem() {
    this.paginacao.listaModels.update(() => this.fornecedoresDisponiveis);
    this.paginacao.paginaAtual = 1;
    this.setupPaginacao();
    this.showLoadingComponent(false);
  }

  ordenarTabela(colunaOrdenar: string, ordem: string) {
    this.fornecedoresDisponiveis.sort(this.compare<Fornecedor>(colunaOrdenar, ordem));
    this.atualizarListagem();
  }

  atualizarFornecedor(id: number) {
    this.alterarPaginaAtual.emit({ nomePagina: 'FORNECEDOR-FORM', itemId: id });
  }

  gotoCadastro() {
    this.alterarPaginaAtual.emit({ nomePagina: 'FORNECEDOR-FORM', itemId: 0});
  }

  confirmarRemocaoFornecedor(fornecedor: Fornecedor) {
    this.fornecedorSelecionado = fornecedor;
    this.openModal({
      title: 'AVISO',
      message: 'Deseja realmente remover este fornecedor? <p><center><b>'+this.fornecedorSelecionado.empresa+'</b></center></p>',
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
      this.remocaoFornecedorConfirmada();
    }
  }

  async remocaoFornecedorConfirmada() {
    this.showLoadingComponent(true);

    try {
      const genericResponse: GenericResponse = await this.fornecedorService.deleteById(this.fornecedorSelecionado.id);

      if (genericResponse) {
        this.obterFornecedores();
        this.showLoadingComponent(false);

        this.openModal({
          title: 'Fornecedor Removido',
          message: 'Fornecedor <b>'+this.fornecedorSelecionado.empresa+'</b> removido com sucesso!',
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

  getListaFornecedores() : Fornecedor[] {
    return <Fornecedor[]> this.paginacao.listaModelsPaginados();
  }

  formatPhoneForWhatsapp(phone?: string) {
    return '+55' + phone?.trim().replace(/[^0-9]/g,'')
  }

  executarBuscaOnKeyboard(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = <HTMLInputElement>event.target;
      const value = input.value.trim();
      this.obterFornecedores(value);
    }
  }

  executarBuscaOnBlur(event: Event) {
    const input = <HTMLInputElement>event.target;
    const value = input.value.trim();
    this.obterFornecedores(value);
  }

}
