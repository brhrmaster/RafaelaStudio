import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { Cidade, CidadeResponse, Estado, EstadoResponse, Fornecedor, ModalContent, NavegacaoApp, ResponseData } from '../../models/models.component';
import { FornecedorService } from '../../services/fornecedor.service';
import { LocalidadeService } from '../../services/localidade.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { BaseTela } from '../../componentes/BaseTela';

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
export class FornecedorFormComponent extends BaseTela {
  errorMessage: string = '';
  fornecedorSelecionado: Fornecedor = { id: 0 };
  isLoadingVisible: boolean = false;
  cidades = signal<Cidade[]>([]);
  estados = signal<Estado[]>([]);
  private isCadastroFinished = false;
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
    super();
    this.obterEstados();
  }

  async ngOnChanges() {
    if (this.itemId && this.itemId > 0) {
      this.prepararFornecedorParaAtualizar();
    } else {
      this.fornecedorForm.reset();
      this.cidades.update(() => []);
    }
  }

  async prepararFornecedorParaAtualizar() {
    this.showLoadingComponent(true);
    try {
      const fornecedorResponse: Fornecedor = await this.fornecedorService.getById(this.itemId);

      if (fornecedorResponse) {
        this.showLoadingComponent(false);

        await this.obterCidades(fornecedorResponse.estadoId!);

        this.fornecedorForm.setValue({
          empresa: fornecedorResponse.empresa!,
          nomeRepresentante: fornecedorResponse.nomeRepresentante!,
          telefone: fornecedorResponse.telefone!,
          email: fornecedorResponse.email!,
          endereco: fornecedorResponse.endereco!,
          numero: fornecedorResponse.numero!,
          cep: fornecedorResponse.cep!,
          estadoId: fornecedorResponse.estadoId!,
          cidadeId: fornecedorResponse.cidadeId!,
          site: fornecedorResponse.site!,
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
        this.errorMessage = error.error;
        this.showLoadingComponent(false);
      }
    }
  }

  async obterCidades(estadoId: number) {
    if (estadoId <= 0) return;
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
        this.errorMessage = error.error;
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
      let modo = '';

      if (this.itemId > 0) {
        modo = 'atualizado';
        this.fornecedorSelecionado.id = this.itemId;
        await this.fornecedorService.update(this.fornecedorSelecionado);
      } else {
        modo = 'cadastrado';
        await this.fornecedorService.createNew(this.fornecedorSelecionado);
      }

      this.showLoadingComponent(false);
      this.isCadastroFinished = true;
      this.openModal({
        title: 'Sucesso!',
        message: `Fornecedor <b>${this.fornecedorSelecionado.empresa}</b> ${modo} com sucesso!`,
        cancelButtonText: 'OK',
        cancelButtonClass: 'btn-success'
      });
    } catch (error: any) {
      if (error && error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
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
      this.alterarPaginaAtual.emit({ nomePagina: 'FORNECEDOR-LISTA', itemId: 0, itemNome: '' });
    }

    if (action === 'confirm-cancel') {
      this.alterarPaginaAtual.emit({ nomePagina: 'FORNECEDOR-LISTA', itemId: 0, itemNome: '' });
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
