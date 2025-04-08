import { Fornecedor, GetFornecedoresResponse, GetProdutoFormatosResponse, ModalContent, NavegacaoApp, ProdutoInsert, ResponseData } from './../../models/models.component';
import { Component, EventEmitter, inject, Output, ViewChild, ElementRef, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { ProdutoFormato } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { FornecedorService } from '../../services/fornecedor.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../componentes/modal/modal-generic/modal-generic.component';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from "ng2-currency-mask";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

@Component({
  selector: 'app-produto-form',
  imports: [
    CommonModule,
    LoadingComponent,
    ReactiveFormsModule,
    CurrencyMaskModule
  ],
  providers: [
      { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  templateUrl: './produto-form.component.html',
  styleUrls: [
    '../../styles/tela-form.css',
    './produto-form.component.css'
  ]
})
export class ProdutoFormComponent {

  errorMessage: string = '';
  isLoadingVisible: boolean = false;
  produtoFormatos = signal<ProdutoFormato[]>([]);
  fornecedoresDisponiveis = signal<Fornecedor[]>([]);
  fornecedoresSelecionados = signal<Fornecedor[]>([]);
  produtoSelecionado: ProdutoInsert = { id: 0, fornecedores: [] };
  private isCadastroFinished = false;
  private currentModal!: NgbModalRef;
  private modalService = inject(NgbModal);
  private produtoService: ProdutoService = inject(ProdutoService);
  private fornecedorService: FornecedorService = inject(FornecedorService);
  @ViewChild('comboFornecedoresDisponiveis') comboFornecedoresDisponiveis!: ElementRef;
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Input({ required: true }) itemId!: number;

  protected produtoForm = new FormGroup({
    id: new FormControl(0),
    nome: new FormControl('', Validators.required),
    preco: new FormControl(0, Validators.required),
    isValidadeDefinida: new FormControl(false, Validators.required),
    formatoId: new FormControl(0, Validators.required)
  });

  constructor() {
    this.obterFormatos();
    this.obterFornecedores();
  }

  async ngOnChanges() {
    if (this.itemId && this.itemId > 0) {
      this.prepararProdutoParaAtualizar();
    }
  }

  async prepararProdutoParaAtualizar() {
    this.showLoadingComponent(true);
    try {
      const produtoResponse: ProdutoInsert = await this.produtoService.getById(this.itemId);

      if (produtoResponse) {
        this.showLoadingComponent(false);

        this.produtoForm.setValue( {
          id: this.itemId,
          formatoId: produtoResponse.formatoId!,
          isValidadeDefinida: produtoResponse.isValidadeDefinida!,
          nome: produtoResponse.nome!,
          preco: produtoResponse.preco!
        });

        this.preencherFornecedoresSelecionados(produtoResponse.fornecedores);
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
      if (error && error.statud == 404) {
        this.isCadastroFinished = true;
        this.openModal({
          title: 'AVISO',
          message: 'Produto indispon&iacute;vel!',
          cancelButtonText: 'OK',
          cancelButtonClass: 'btn-success'
        });
      }
    }
  }

  preencherFornecedoresSelecionados(fornecedorIds: number[]) {
    const tempFornecedores = [...this.fornecedoresDisponiveis()];
    tempFornecedores.forEach(fornecedor => {
      if (fornecedorIds.includes(fornecedor.id)) {
        this.transferirFornecedorSelecionadoParaCaixa(fornecedor.id);
      }
    })
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  incluirFornecedorSelecionado() {
    const fornecedorId = this.comboFornecedoresDisponiveis.nativeElement.value;
    this.transferirFornecedorSelecionadoParaCaixa(fornecedorId);
  }

  transferirFornecedorSelecionadoParaCaixa(fornecedorId: number) {
    for (let i=0; i < this.fornecedoresDisponiveis().length; i++) {
      if (this.fornecedoresDisponiveis()[i].id == fornecedorId) {
        this.fornecedoresSelecionados.update(fornecedores => {
          fornecedores.push(this.fornecedoresDisponiveis()[i]);
          return fornecedores;
        });
        this.fornecedoresDisponiveis.update(fornecedores => {
          fornecedores.splice(i, 1);
          return fornecedores;
        });
        break;
      }
    }
  }

  removerFornecedorSelecionado(fornecedor: Fornecedor) {
    for (let i=0; i < this.fornecedoresSelecionados().length; i++) {
      if (this.fornecedoresSelecionados()[i].id == fornecedor.id) {
        this.fornecedoresDisponiveis.update(fornecedores => {
          fornecedores.push(this.fornecedoresSelecionados()[i]);
          return fornecedores;
        });
        this.fornecedoresSelecionados.update(fornecedores => {
          fornecedores.splice(i, 1);
          return fornecedores;
        });
        break;
      }
    }
  }

  async obterFormatos() {
    this.showLoadingComponent(true);
    try {
      const getProdutoFormatosResponse: GetProdutoFormatosResponse = await this.produtoService.getFormatos();

      if (getProdutoFormatosResponse) {
        this.produtoFormatos.update(() => getProdutoFormatosResponse.produtoFormatos);
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

  async obterFornecedores() {
    this.showLoadingComponent(true);

    try {
      const getFornecedoresResponse: GetFornecedoresResponse = await this.fornecedorService.getAllSimples();

      if (getFornecedoresResponse) {
        this.fornecedoresDisponiveis.update(() => getFornecedoresResponse.fornecedores);
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

  async onSubmitForm() {
    this.showLoadingComponent(true);
    this.produtoSelecionado = <ProdutoInsert>this.produtoForm.value;
    this.produtoSelecionado.fornecedores = this.fornecedoresSelecionados().map(fornecedor => fornecedor.id!);

    try {
      let modo = '';

      if (this.itemId && this.itemId > 0) {
        modo = 'atualizado';
        await this.produtoService.update(this.produtoSelecionado);
      } else {
        modo = 'cadastrado';
        await this.produtoService.createNew(this.produtoSelecionado);
      }

      this.showLoadingComponent(false);
      this.isCadastroFinished = true;
      this.openModal({
        title: 'Sucesso!',
        message: `Produto <b>${this.produtoSelecionado.nome}</b> ${modo} com sucesso!`,
        cancelButtonText: 'OK',
        cancelButtonClass: 'btn-success'
      });
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

  async modalAction(action: string) {
    this.currentModal.close();

    if (this.isCadastroFinished && action === 'close') {
      this.alterarPaginaAtual.emit({ nomePagina: 'PRODUTO-LISTA', itemId: 0});
    }

    if (action === 'confirm-cancel') {
      this.alterarPaginaAtual.emit({ nomePagina: 'PRODUTO-LISTA', itemId: 0});
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
