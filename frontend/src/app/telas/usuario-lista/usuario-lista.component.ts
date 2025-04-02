import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { UsuarioService } from '../../services/usuario.service';
import { catchError } from 'rxjs';
import { Usuario } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";

@Component({
  selector: 'app-usuario-lista',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './usuario-lista.component.html',
  styles: ''
})
export class UsuarioListaComponent extends BaseTelaListagemComponent {
  usuarios = [];
  usuarioSelecionado = {};
  errorMessage!: string;
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  usuarioService: UsuarioService = inject(UsuarioService);

  constructor() {
    super();
  }

  showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  obterUsuarios() {
    this.showLoadingComponent(true);

    this.usuarioService.getAll('')
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((getUsuariosResponse) => {
      if (getUsuariosResponse) {
        this.paginacao.listaModels = getUsuariosResponse.users;

        console.log(this.paginacao.listaModels);
        this.setupPaginacao();
        this.showLoadingComponent(false);
      }
    });
  }

  atualizarUsuario(id: number) {

    this.showLoadingComponent(true);

    // chamar tela fornecedor-form para atualizar com base no ID
    console.log('abrir tela usuario-form com o id ' + id);
  }

  deletarUsuario(id: number) {

    this.showLoadingComponent(true);

    this.usuarioService.deleteById(id)
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((genericResponse) => {
      console.log(genericResponse);
      this.obterUsuarios();
      this.showLoadingComponent(false);
    });
  }

  getListaUsuarios() : Usuario[] {
    return <Usuario[]> this.paginacao.listaModelsPaginados;
  }
}
