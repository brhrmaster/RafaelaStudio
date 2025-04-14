import { Fornecedor, GetFornecedoresResponse, GetProdutoFormatosResponse, ModalContent, NavegacaoApp, ProdutoInsert, ResponseData } from '../../models/models.component';
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
  selector: 'app-entrada-saida-form',
  imports: [
    CommonModule,
    LoadingComponent,
    ReactiveFormsModule,
    CurrencyMaskModule
  ],
  providers: [
      { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  templateUrl: './entrada-saida-form.component.html',
  styleUrls: [
    '../../styles/tela-form.css',
    './entrada-saida-form.component.css'
  ]
})
export class EntradaSaidaFormComponent {

  errorMessage: string = '';
  isLoadingVisible: boolean = false;
  produtoSelecionado: ProdutoInsert = { id: 0, fornecedores: [] };
  private isCadastroFinished = false;
  private currentModal!: NgbModalRef;
  private modalService = inject(NgbModal);
  private produtoService: ProdutoService = inject(ProdutoService);
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Input({ required: true }) itemId!: number;
  @Input({ required: true }) itemModo!: number;

  protected entradaSaidaForm = new FormGroup({
    produtoNome: new FormControl(''),
    isValidadeDefinida: new FormControl('0'),
  });

  constructor() {
  }

  async ngOnChanges() {
    if (this.itemId > 0) {
      this.prepararProdutoParaCadastrarEntradaSaida();
    } else {
      this.errorMessage = 'Nenhum produto selecionado!';
    }
  }

  async prepararProdutoParaCadastrarEntradaSaida() {
    this.showLoadingComponent(true);
    try {
      console.log(this.itemId);
      const produtoResponse: ProdutoInsert = await this.produtoService.getById(this.itemId);

      if (produtoResponse) {
        this.showLoadingComponent(false);
        this.produtoSelecionado = produtoResponse;

        this.entradaSaidaForm.setValue({
          produtoNome: this.produtoSelecionado.nome!,
          isValidadeDefinida: this.produtoSelecionado.isValidadeDefinida ? '1' : '0'
        });
        this.entradaSaidaForm.controls.produtoNome.disable();
        this.entradaSaidaForm.controls.isValidadeDefinida.disable();
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
          message: 'Produto indispon&iacute;vel!',
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
    //this.showLoadingComponent(true);


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
      message: `Deseja realmente <b>descartar</b> este registro de estoque?`,
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
