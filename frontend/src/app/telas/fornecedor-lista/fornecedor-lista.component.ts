import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FornecedorService } from '../../services/fornecedor.service';
import { Fornecedor } from '../../models/models.component';
import { catchError } from 'rxjs';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { LoadingComponent } from "../../componentes/loading/loading.component";

@Component({
  selector: 'app-fornecedor-lista',
  imports: [
    CommonModule,
    LoadingComponent
],
  templateUrl: './fornecedor-lista.component.html',
  styleUrls: [
    '../../styles/tela-lista-registros.css'
  ]
})
export class FornecedorListaComponent extends BaseTelaListagemComponent {
  fornecedorFiltro: string = '';
  errorMessage: string = '';
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @ViewChild('txtbusca') txtBusca!: ElementRef;

  constructor(private fornecedorService: FornecedorService) {
    super(5);
    this.obterFornecedores();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  obterFornecedores(busca: string = '') {
    this.showLoadingComponent(true);

    this.fornecedorService.getAll(busca.trim())
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((getFornecedoresResponse) => {
      if (getFornecedoresResponse) {
        this.paginacao.listaModels = getFornecedoresResponse.fornecedores;

        console.log(this.paginacao.listaModels);
        this.setupPaginacao();
        this.showLoadingComponent(false);
      }
    });
  }

  atualizarFornecedor(id: number) {

    // chamar tela fornecedor-form para atualizar com base no ID
    console.log('abrir tela fornecedor-form com o id ' + id);
  }

  deletarFornecedor(id: number) {
    this.showLoadingComponent(true);

    this.fornecedorService.deleteById(id)
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((genericResponse) => {
      console.log(genericResponse);
      this.obterFornecedores();
      this.showLoadingComponent(false);
    });
  }

  getListaFornecedores() : Fornecedor[] {
    return <Fornecedor[]> this.paginacao.listaModelsPaginados;
  }

  formatPhoneForWhatsapp(phone: string) {
    return '+55' + phone.trim().replace(/[^0-9]/g,'')
  }

  executarBusca(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = <HTMLInputElement>event.target;
      this.obterFornecedores(input.value);
    }
  }
}
