import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { Formato, NavegacaoApp } from '../../models/models.component';
import { FormatoService } from '../../services/formato.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseTela } from '../../componentes/BaseTela';

@Component({
  selector: 'app-formato-form',
  imports: [
    CommonModule,
    LoadingComponent,
    ReactiveFormsModule
  ],
  templateUrl: './formato-form.component.html',
  styleUrls: [
    '../../styles/tela-form.css',
    './formato-form.component.css'
  ]
})
export class FormatoFormComponent extends BaseTela {
  errorMessage: string = '';
  formatoSelecionado: Formato = { id: 0, nome: '' };
  isLoadingVisible: boolean = false;
  private isCadastroFinished = false;
  private formatoService: FormatoService = inject(FormatoService);
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Input({ required: true }) itemId!: number;

  protected formatoForm = new FormGroup({
    nome: new FormControl('', Validators.required)
  });

  constructor() {
    super();
  }

  async ngOnChanges() {
    if (this.itemId && this.itemId > 0) {
      this.prepararFormatoParaAtualizar();
    } else {
      this.formatoForm.reset();
    }
  }

  async prepararFormatoParaAtualizar() {
    this.showLoadingComponent(true);
    try {
      const formatoResponse: Formato = await this.formatoService.getById(this.itemId);

      if (formatoResponse) {
        this.showLoadingComponent(false);

        this.formatoForm.setValue({
          nome: formatoResponse.nome
        });
      }
    } catch (error: any) {
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
      if (error && error.status == 400) {
        this.errorMessage = error.error;
        this.showLoadingComponent(false);
      }
      if (error && error.statud == 404) {
        this.isCadastroFinished = true;
        this.openModal({
          title: 'AVISO',
          message: 'Formato indispon&iacute;vel!',
          cancelButtonText: 'OK',
          cancelButtonClass: 'btn-success'
        });
      }
    }
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async onSubmitForm() {
    this.showLoadingComponent(true);
    this.formatoSelecionado = <Formato>this.formatoForm.value;

    try {
      let modo = '';

      if (this.itemId > 0) {
        modo = 'atualizado';
        this.formatoSelecionado.id = this.itemId;
        await this.formatoService.update(this.formatoSelecionado);
      } else {
        modo = 'cadastrado';
        await this.formatoService.createNew(this.formatoSelecionado);
      }

      this.showLoadingComponent(false);
      this.isCadastroFinished = true;
      this.openModal({
        title: 'Sucesso!',
        message: `Formato <b>${this.formatoSelecionado.nome}</b> ${modo} com sucesso!`,
        cancelButtonText: 'OK',
        cancelButtonClass: 'btn-success'
      });
    } catch (error: any) {
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
      if (error && error.status == 203) {
        this.errorMessage = error.error;
        this.showLoadingComponent(false);
      }
      if (error && error.status == 400) {
        this.errorMessage = error.error;
        this.showLoadingComponent(false);
      }
    }
  }

  async modalAction(action: string) {
    this.currentModal.close();

    if (this.isCadastroFinished && action === 'close') {
      this.alterarPaginaAtual.emit({ nomePagina: 'FORMATO-LISTA', itemId: 0, itemNome: '' });
    }

    if (action === 'confirm-cancel') {
      this.alterarPaginaAtual.emit({ nomePagina: 'FORMATO-LISTA', itemId: 0, itemNome: '' });
    }
  }

  confirmarCancelar() {
    this.openModal({
      title: 'AVISO',
      message: `Deseja realmente <b>descartar</b> ${this.itemId > 0 ? 'esta atualiza&ccedil;&atilde;o': 'este cadastro'}?`,
      cancelButtonText: 'Não',
      cancelButtonClass: 'btn-primary',
      buttons: [
        {
          text: 'Sim',
          action: 'confirm-cancel',
          cssClass: 'btn-danger'
        }
      ]
    });
  }
}
