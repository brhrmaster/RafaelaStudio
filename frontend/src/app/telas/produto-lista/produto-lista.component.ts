import { Component, EventEmitter, Output, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { CommonModule, formatDate, formatCurrency, registerLocaleData  } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { catchError } from 'rxjs';
import { BaseTelaListagemComponent } from '../../componentes/BaseTelaListagemComponent';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/models.component';
import { LoadingComponent } from "../../componentes/loading/loading.component";

registerLocaleData(ptBr);

@Component({
  selector: 'app-produto-lista',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './produto-lista.component.html',
  styleUrls: [
    '../../styles/tela-lista-registros.css'
  ],
  providers:    [
    // ************************************
    { provide: LOCALE_ID, useValue: 'pt' },
    // ************************************
  ],
})
export class ProdutoListaComponent extends BaseTelaListagemComponent {
  produtoFiltro: string = '';
  errorMessage: string = '';
  serverResponse: string = '';
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  constructor(private produtoService: ProdutoService) {
    super();
    this.obterProdutos();
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  obterProdutos() {
    this.showLoadingComponent(true);

    this.produtoService.getAll('')
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((getProdutosResponse) => {
      if (getProdutosResponse) {
        this.paginacao.listaModels = getProdutosResponse.produtos;

        console.log(this.paginacao.listaModels);
        this.setupPaginacao();
        this.showLoadingComponent(false);
      }
    });
  }

  atualizarProduto(id: number) {

    this.showLoadingComponent(true);

    // chamar tela fornecedor-form para atualizar com base no ID
    console.log('abrir tela produto-form com o id ' + id);
  }

  deletarProduto(id: number) {

    this.showLoadingComponent(true);

    this.produtoService.deleteById(id)
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((genericResponse) => {
      console.log(genericResponse);
      this.obterProdutos();
      this.showLoadingComponent(false);
    });
  }

  getListaProdutos() : Produto[] {
    return <Produto[]> this.paginacao.listaModelsPaginados;
  }


  getFormattedDate(datetime: Date) {
    return datetime ? formatDate(datetime, 'dd/MM/yyyy', 'pt-BR') : '';
  }
}
