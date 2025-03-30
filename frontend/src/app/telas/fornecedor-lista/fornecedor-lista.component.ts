import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FornecedorService } from '../../services/fornecedor.service';
import { Fornecedor } from '../../models/models.component';
import { catchError } from 'rxjs';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';

@Component({
  selector: 'app-fornecedor-lista',
  imports: [
    CommonModule
  ],
  templateUrl: './fornecedor-lista.component.html',
  styles: ''
})
export class FornecedorListaComponent extends BaseTelaListagemComponent {
  fornecedorFiltro: string = '';
  errorMessage: string = '';
  serverResponse: string = '';
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  constructor(private fornecedorService: FornecedorService) {
    super();
    this.obterFornecedores();
  }

  obterFornecedores() {
    this.showLoading.emit(true);

    this.fornecedorService.getAll('')
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoading.emit(false);
      }
    }))
    .subscribe((getFornecedoresResponse) => {
      if (getFornecedoresResponse) {
        this.paginacao.listaModels = getFornecedoresResponse.fornecedores;

        console.log(this.paginacao.listaModels);
        this.setupPaginacao();
        this.showLoading.emit(false);
      }
    });
  }

  atualizarFornecedor(id: number) {

    this.showLoading.emit(true);

    // chamar tela fornecedor-form para atualizar com base no ID
    console.log('abrir tela fornecedor-form com o id ' + id);
  }

  deletarFornecedor(id: number) {

    this.showLoading.emit(true);

    this.fornecedorService.deleteById(id)
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoading.emit(false);
      }
    }))
    .subscribe((genericResponse) => {
      console.log(genericResponse);
      this.obterFornecedores();
      this.showLoading.emit(false);
    });
  }

  getListaFornecedores() : Fornecedor[] {
    return <Fornecedor[]> this.paginacao.listaModelsPaginados;
  }
}
