import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { UsuarioService } from '../../services/usuario.service';
import { GenericResponse, GetUsuariosResponse, ModalContent, NavegacaoApp, Usuario } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../componentes/modal/modal-generic/modal-generic.component';

@Component({
  selector: 'app-usuario-lista',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './usuario-lista.component.html',
  styleUrls: [
    '../../styles/tela-lista-registros.css'
  ],
})
export class UsuarioListaComponent extends BaseTelaListagemComponent {
  errorMessage!: string;
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  private modalService = inject(NgbModal);
  private currentModal!: NgbModalRef;
  private usuarioService: UsuarioService = inject(UsuarioService);
  usuarioSelecionado!: Usuario;

  constructor() {
    super();
    this.obterUsuarios();
  }

  showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async obterUsuarios(busca: string = '') {
    this.showLoadingComponent(true);

    try {
      const getUsuariosResponse: GetUsuariosResponse = await this.usuarioService.getAll(busca.trim());

      if (getUsuariosResponse) {
        this.paginacao.listaModels.update(() => getUsuariosResponse.users);
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

  atualizarUsuario(id: number) {

    this.showLoadingComponent(true);

    // chamar tela fornecedor-form para atualizar com base no ID
    console.log('abrir tela usuario-form com o id ' + id);
  }

  confirmarRemocaoFornecedor(usuario: Usuario) {
    this.usuarioSelecionado = usuario;
    this.openModal({
      title: 'AVISO',
      message: 'Deseja realmente remover o usuário '+this.usuarioSelecionado.nome+'?',
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
      this.remocaoUsuarioConfirmada();
    }
  }

  async remocaoUsuarioConfirmada() {
    this.showLoadingComponent(true);

    try {
      const genericResponse: GenericResponse = await this.usuarioService.deleteById(this.usuarioSelecionado.id);

      if (genericResponse) {
        this.obterUsuarios();
        this.showLoadingComponent(false);

        this.openModal({
          title: 'Usuário Removido',
          message: 'Usuário '+this.usuarioSelecionado.nome+' removido com sucesso!',
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

  getListaUsuarios() : Usuario[] {
    return <Usuario[]> this.paginacao.listaModelsPaginados();
  }

  executarBuscaOnKeyboard(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = <HTMLInputElement>event.target;
      const value = input.value.trim();
      this.obterUsuarios(value);
    }
  }

  executarBuscaOnBlur(event: Event) {
    const input = <HTMLInputElement>event.target;
    const value = input.value.trim();
    this.obterUsuarios(value);
  }
}
