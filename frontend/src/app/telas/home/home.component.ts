import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { CommonModule, DatePipe } from '@angular/common';
import Chart from 'chart.js/auto';
import Utils from '../../componentes/utils';
import { ReportsService } from '../../services/reports.service';
import { catchError } from 'rxjs';
import { GetReportsData } from '../../models/models.component';

@Component({
  selector: 'app-home',
  imports: [LoadingComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  errorMessage: string = '';
  isLoadingVisible: boolean = false;
  pieChart: any = [];
  linesChart: any = [];
  reportsData: GetReportsData = {
    totalFornecedoresRecentementeCriados: 0,
    totalProdutosRecentementeCriados: 0,
    totalProdutosPorFornecedor: [],
    totalEntradaSaidaProdutos: []
  };
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  constructor(private reportsService: ReportsService) {}

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  obterDadosReports() {
    this.showLoadingComponent(true);

    this.reportsService.getReports()
    .pipe(catchError(async (error) => {
      if (error.status == 0) {
        this.errorMessage = 'Falha na comunicação com o servidor';
        this.showLoadingComponent(false);
      }
    }))
    .subscribe((getReportsResponse) => {
      if (getReportsResponse) {
        this.reportsData = getReportsResponse;
        this.setupGraficoEntradasSaidas();
        this.setupGraficoFornecedores();
        this.showLoadingComponent(false);
      }
    });
  }


  setupGraficoFornecedores() {
    const totalProdutosPorFornecedor: number[] = [];
    const xlabels: string[] = [];

    this.reportsData.totalProdutosPorFornecedor.forEach(fornecedor => {
      totalProdutosPorFornecedor.push(fornecedor.totalProdutos);
      xlabels.push(fornecedor.empresa);
    });

    const dataForPie = {
      labels: xlabels,
      datasets: [{
        label: 'Produtos fornecidos',
        data: totalProdutosPorFornecedor,
        hoverOffset: 4
      }]
    };

    this.pieChart = new Chart('canvas-pie-chart', {
      type: 'doughnut',
      data: dataForPie
    });
  }

  setupGraficoEntradasSaidas() {
    const datePipe = new DatePipe('pt');
    interface ValoresGrafico {
      entrada: number,
      saida: number,
    };

    const entradasSaidas: ValoresGrafico[] = [];
    const xlabels: string[] = [];
    let maxEntrada = 0;
    let maxSaida = 0;

    this.reportsData.totalEntradaSaidaProdutos.forEach(item => {
      const isEntrada = item.tipo == 1;

      if (isEntrada) {
        entradasSaidas.push({
          entrada: item.total,
          saida: 0
        });
      } else {
        entradasSaidas.push({
          entrada: 0,
          saida: item.total
        });
      }

      if (!xlabels.includes(item.dayOfMonth)) xlabels.push("" + datePipe.transform(item.dayOfMonth, 'dd/MM/yyyy'));
    });

    const itemsEntradas = entradasSaidas.map(item => item.entrada);
    const itemsSaidas = entradasSaidas.map(item => item.saida);

    const NUMBER_CFG_Entradas = {
      count: itemsEntradas.length,
      min: 0,
      max: maxEntrada,
      from: itemsEntradas,
      decimals: 0,
      continuity: 0
    };

    const NUMBER_CFG_Saidas = {
      count: itemsSaidas.length,
      min: 0,
      max: maxSaida,
      from: itemsSaidas,
      decimals: 0,
      continuity: 0
    };

    const dataForLines = {
      labels: xlabels,
      datasets: [
        {
          label: 'Entradas',
          data: Utils.numbers(NUMBER_CFG_Entradas),
          borderColor: Utils.CHART_COLORS.green,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.5),
        },
        {
          label: 'Saídas',
          data: Utils.numbers(NUMBER_CFG_Saidas),
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        }
      ]
    };


    this.linesChart = new Chart('canvas-lines-chart', {
      type: 'line',
      data: dataForLines,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Entradas e Saídas'
          }
        }
      }
    });
  }

  ngOnInit() {
    this.obterDadosReports();
  }
}
