import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { Cidade, CidadeResponse, Estado, EstadoResponse, Fornecedor, ModalContent, NavegacaoApp, ResponseData } from '../../models/models.component';
import { FornecedorService } from '../../services/fornecedor.service';
import { LocalidadeService } from '../../services/localidade.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../componentes/modal/modal-generic/modal-generic.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-fornecedor-form',
  imports: [
    CommonModule,
    LoadingComponent,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask({ /* opções de cfg */ })
  ],
  templateUrl: './fornecedor-form.component.html',
  styleUrls: [
    '../../styles/tela-form.css',
    './fornecedor-form.component.css'
  ]
})
export class FornecedorFormComponent {
  errorMessage: string = '';
  fornecedorSelecionado: Fornecedor = { id: 0 };
  isLoadingVisible: boolean = false;
  cidades = signal<Cidade[]>([]);
  estados = signal<Estado[]>([]);
  private isCadastroFinished = false;
  private currentModal!: NgbModalRef;
  private modalService = inject(NgbModal);
  private fornecedorService: FornecedorService = inject(FornecedorService);
  private localidadeService: LocalidadeService = inject(LocalidadeService);
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Input({ required: true }) itemId!: number;

  protected fornecedorForm = new FormGroup({
    empresa: new FormControl('', Validators.required),
    nomeRepresentante: new FormControl('', Validators.required),
    telefone: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    endereco: new FormControl(''),
    numero: new FormControl(''),
    cep: new FormControl(''),
    estadoId: new FormControl(0, Validators.min(1)),
    cidadeId: new FormControl(0, Validators.min(1)),
    site: new FormControl('')
  });

  constructor() {
    this.obterEstados();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async obterEstados() {
    this.showLoadingComponent(true);

    try {
      const estadosResponse: EstadoResponse = await this.localidadeService.getEstados();
      if (estadosResponse) {
        this.estados.update(() => estadosResponse.estados);
        this.showLoadingComponent(false);
      }
    } catch (error: any) {
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
      if (error && error.status == 400) {
        this.errorMessage = error.message;
        this.showLoadingComponent(false);
      }
    }
  }

  async obterCidades(estadoId: number) {
    this.showLoadingComponent(true);

    try {
      const cidadeResponse: CidadeResponse = await this.localidadeService.getCidades(estadoId);

      if (cidadeResponse) {
        this.cidades.update(() => cidadeResponse.cidades);
        this.showLoadingComponent(false);
        this.fornecedorForm.value.cidadeId = 0;
      }
    } catch (error: any) {
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
      if (error && error.status == 400) {
        this.errorMessage = error.message;
        this.showLoadingComponent(false);
      }
    }
  }

  estadoSelecionado(event: Event) {
    const input = <HTMLInputElement>event.target;
    const value = input.value;
    this.obterCidades(Number(value));
  }

  async onSubmitForm() {
    this.showLoadingComponent(true);
    this.fornecedorSelecionado = <Fornecedor>this.fornecedorForm.value;

    try {
      const genericResponse: ResponseData = await this.fornecedorService.createNew(this.fornecedorSelecionado);

      if (genericResponse) {
        this.showLoadingComponent(false);
        this.isCadastroFinished = true;
        this.openModal({
          title: 'Sucesso!',
          message: 'Fornecedor <b>'+this.fornecedorSelecionado.empresa+'</b> cadastrado com sucesso!',
          cancelButtonText: 'OK',
          cancelButtonClass: 'btn-success'
        });
      }
    } catch (error: any) {
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }
  }

  async modalAction(action: string) {
    this.currentModal.close();

    if (this.isCadastroFinished && action === 'close') {
      this.alterarPaginaAtual.emit({ nomePagina: 'FORNECEDOR-LISTA', itemId: 0});
    }

    if (action === 'confirm-cancel') {
      this.alterarPaginaAtual.emit({ nomePagina: 'FORNECEDOR-LISTA', itemId: 0});
    }
  }

  openModal(modalContent: ModalContent) {
    this.currentModal = this.modalService.open(ModalComponent);
    this.currentModal.componentInstance.modalContent = modalContent;
    this.currentModal.componentInstance.onModalAction.subscribe(async (action:string) => await this.modalAction(action));
  }

  confirmarCancelar() {
    this.openModal({
      title: 'AVISO',
      message: 'Deseja realmente <b>descartar</b> este cadastro?',
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
