import { Component, ElementRef, EventEmitter, inject, Output, Type, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatoService } from '../../services/formato.service';
import { Formato, GenericResponse, GetFormatosResponse, ModalContent, NavegacaoApp } from '../../models/models.component';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { LoadingComponent } from "../../componentes/loading/loading.component";

@Component({
  selector: 'app-formato-lista',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './formato-lista.component.html',
  styleUrls: [
    '../../styles/tela-lista-registros.css'
  ]
})
export class FormatoListaComponent extends BaseTelaListagemComponent {
  errorMessage: string = '';
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  private formatoService: FormatoService = inject(FormatoService);
  formatoSelecionado!: Formato;
  formatosDisponiveis!: Formato[];

  constructor() {
    super();
    this.obterFormatos();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async obterFormatos(busca: string = '') {
    this.showLoadingComponent(true);

    try {
      const formatosResponse: GetFormatosResponse = await this.formatoService.getAll(busca.trim());

      if (formatosResponse) {
        this.formatosDisponiveis = formatosResponse.produtoFormatos;
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
    this.paginacao.listaModels.update(() => this.formatosDisponiveis);
    this.paginacao.paginaAtual = 1;
    this.setupPaginacao();
    this.showLoadingComponent(false);
  }

  ordenarTabela(colunaOrdenar: string, ordem: string) {
    this.formatosDisponiveis.sort(this.compare<Formato>(colunaOrdenar, ordem));
    this.atualizarListagem();
  }

  atualizarFormato(id: number) {
    this.alterarPaginaAtual.emit({ nomePagina: 'FORMATO-FORM', itemId: id });
  }

  gotoCadastro() {
    this.alterarPaginaAtual.emit({ nomePagina: 'FORMATO-FORM', itemId: 0});
  }

  confirmarRemocaoFormato(formato: Formato) {
    this.formatoSelecionado = formato;
    this.openModal({
      title: 'AVISO',
      message: 'Deseja realmente remover este formato? <p><center><b>'+this.formatoSelecionado.nome+'</b></center></p>',
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
      this.remocaoFormatoConfirmada();
    }
  }

  async remocaoFormatoConfirmada() {
    this.showLoadingComponent(true);

    try {
      const genericResponse: GenericResponse = await this.formatoService.deleteById(this.formatoSelecionado.id);

      if (genericResponse) {
        this.obterFormatos();
        this.showLoadingComponent(false);

        this.openModal({
          title: 'Formato Removido',
          message: 'Formato <b>'+this.formatoSelecionado.nome+'</b> removido com sucesso!',
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

  getListaFormatos() : Formato[] {
    return <Formato[]> this.paginacao.listaModelsPaginados();
  }

  executarBuscaOnKeyboard(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = <HTMLInputElement>event.target;
      const value = input.value.trim();
      this.obterFormatos(value);
    }
  }

  executarBuscaOnBlur(event: Event) {
    const input = <HTMLInputElement>event.target;
    const value = input.value.trim();
    this.obterFormatos(value);
  }
}
