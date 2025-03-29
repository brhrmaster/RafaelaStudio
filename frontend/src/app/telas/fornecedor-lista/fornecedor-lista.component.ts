import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FornecedorService } from '../../services/fornecedor.service';
import { Fornecedor } from '../../models/models.component';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-fornecedor-lista',
  imports: [
    CommonModule
  ],
  templateUrl: './fornecedor-lista.component.html',
  styles: ''
})
export class FornecedorListaComponent {
  fornecedores!: Fornecedor[];
  fornecedoresPaginados!: Fornecedor[];
  forecedorSelecionado!: Fornecedor;
  fornecedorFiltro: string = '';
  errorMessage: string = '';
  serverResponse: string = '';
  paginaAtual: number = 1;
  totalPaginas: number = 1;
  totalPorPagina: number = 3;
  totalRegistros: number = 0;
  @Output() showLoading = new EventEmitter<boolean>();

  constructor(private fornecedorService: FornecedorService) {
    this.obterFornecedores();
  }

  private showLogin(show: boolean) {
    this.showLoading.emit(show);
  }

  obterFornecedores() {

    this.showLogin(true);

    this.fornecedorService.getAll('')
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLogin(false);
      }
    }))
    .subscribe((getFornecedoresResponse) => {
      if (getFornecedoresResponse) {
        this.fornecedores = getFornecedoresResponse.fornecedores;

        console.log(this.fornecedores);
        this.setupPaginacao();
        this.showLogin(false);
      }
    });
  }

  atualizarFornecedor(id: number) {

    this.showLogin(true);

    // chamar tela fornecedor-form para atualizar com base no ID
    console.log('abrir tela fornecedor-form com o id ' + id);
  }

  deletarFornecedor(id: number) {

    this.showLogin(true);

    this.fornecedorService.deleteById(id)
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLogin(false);
      }
    }))
    .subscribe((genericResponse) => {
      console.log(genericResponse);
      this.obterFornecedores();
      this.showLogin(false);
    });
  }

  setupPaginacao() {
    if (this.fornecedores) {
      this.totalRegistros = this.fornecedores.length;
      this.totalPaginas = Math.ceil(this.totalRegistros / this.totalPorPagina);
      this.fatiarListaDeFornecedores();
    }
  }

  fatiarListaDeFornecedores() {
    const startIndex = (this.paginaAtual - 1) * this.totalPorPagina;
    const endIndex = startIndex + this.totalPorPagina;
    this.fornecedoresPaginados = this.fornecedores.slice(startIndex, endIndex);
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.fatiarListaDeFornecedores();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual >= 1) {
      this.paginaAtual--;
      this.fatiarListaDeFornecedores();
    }
  }
}
