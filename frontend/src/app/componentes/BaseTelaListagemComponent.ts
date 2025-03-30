import { Model } from "../models/models.component";

export class Paginacao {
    listaModels!: Model[];
    listaModelsPaginados!: Model[];
    modelSelecionado!: Model;
    paginaAtual: number = 1;
    totalPaginas: number = 1;
    totalPorPagina: number = 0;
    totalRegistros: number = 0;
}

export abstract class BaseTelaListagemComponent {
  protected paginacao: Paginacao;

  constructor(totalPorPagina: number = 10) {
    this.paginacao = new Paginacao();
    this.paginacao.totalPorPagina = totalPorPagina;
  }

  protected fatiarListaModels() {
    const startIndex = (this.paginacao.paginaAtual - 1) * this.paginacao.totalPorPagina;
    const endIndex = startIndex + this.paginacao.totalPorPagina;
    this.paginacao.listaModelsPaginados = this.paginacao.listaModels.slice(startIndex, endIndex);
  }

  protected setupPaginacao() {
    if (this.paginacao.listaModels) {
      this.paginacao.totalRegistros = this.paginacao.listaModels.length;
      this.paginacao.totalPaginas = Math.ceil(this.paginacao.totalRegistros / this.paginacao.totalPorPagina);
      this.fatiarListaModels();
    }
  }

  protected proximaPagina() {
    if (this.paginacao.paginaAtual < this.paginacao.totalPaginas) {
      this.paginacao.paginaAtual++;
      this.fatiarListaModels();
    }
  }

  protected paginaAnterior() {
    if (this.paginacao.paginaAtual >= 1) {
      this.paginacao.paginaAtual--;
      this.fatiarListaModels();
    }
  }
}
