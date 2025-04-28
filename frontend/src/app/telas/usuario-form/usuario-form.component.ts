import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { NavegacaoApp, UsuarioUpdate } from '../../models/models.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { BaseTela } from '../../componentes/BaseTela';

@Component({
  selector: 'app-usuario-form',
  imports: [
    CommonModule,
    LoadingComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: [
    '../../styles/tela-form.css',
    './usuario-form.component.css'
  ]
})
export class UsuarioFormComponent extends BaseTela {
  errorMessage: string = '';
  usuarioSelecionado: UsuarioUpdate = { id: 0, login: '', nome: '', password: '' };
  isLoadingVisible: boolean = false;
  private isCadastroFinished = false;
  private usuarioService: UsuarioService = inject(UsuarioService);
  @Output() alterarPaginaAtual = new EventEmitter<NavegacaoApp>();
  @Input({ required: true }) itemId!: number;
  modoSenha: string = 'Definir';

  protected usuarioForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    login: new FormControl('', Validators.required),
    password: new FormControl(''),
    confirmarSenha: new FormControl('', this.valuesAreEqualValidator('password', 'confirmaSenha')),
  });

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  async ngOnChanges() {
    if (this.itemId > 0) {
      this.prepararUsuarioParaAtualizar();
      this.modoSenha = 'Redefinir'
    } else {
      this.usuarioForm.reset();
      this.usuarioForm.controls.password.addValidators(Validators.required);
      this.usuarioForm.controls.confirmarSenha.addValidators(Validators.required);
    }
  }


  async prepararUsuarioParaAtualizar() {
    this.showLoadingComponent(true);
    try {
      const usuarioResponse: UsuarioUpdate = await this.usuarioService.getById(this.itemId);

      if (usuarioResponse) {
        this.showLoadingComponent(false);

        this.usuarioForm.setValue({
          nome: usuarioResponse.nome,
          login: usuarioResponse.login,
          password: '',
          confirmarSenha: ''
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
          message: 'Usu&aacute;rio indispon&iacute;vel!',
          cancelButtonText: 'OK',
          cancelButtonClass: 'btn-success'
        });
      }
    }
  }

  async onSubmitForm() {
    this.showLoadingComponent(true);
    this.usuarioSelecionado = <UsuarioUpdate>this.usuarioForm.value;

    try {
      let modo = '';

      if (this.itemId > 0) {
        modo = 'atualizado';
        this.usuarioSelecionado.id = this.itemId;
        await this.usuarioService.update(this.usuarioSelecionado);
      } else {
        modo = 'cadastrado';
        await this.usuarioService.createNew(this.usuarioSelecionado);
      }

      this.showLoadingComponent(false);
      this.isCadastroFinished = true;
      this.openModal({
        title: 'Sucesso!',
        message: `Us&aacute;rio <b>${this.usuarioSelecionado.nome}</b> ${modo} com sucesso!`,
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
      this.alterarPaginaAtual.emit({ nomePagina: 'USUARIO-LISTA', itemId: 0});
    }

    if (action === 'confirm-cancel') {
      this.alterarPaginaAtual.emit({ nomePagina: 'USUARIO-LISTA', itemId: 0});
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

  valuesAreEqualValidator(controlName1: string, controlName2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const control1 = control.get(controlName1);
      const control2 = control.get(controlName2);

      if (control1 && control2 && control1.value !== control2.value) {
        return { notEqual: true };
      }
      return null;
    };
  }
}
