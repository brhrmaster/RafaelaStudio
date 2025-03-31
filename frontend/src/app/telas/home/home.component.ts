import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { CommonModule } from '@angular/common';
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
export class HomeComponent implements OnInit {

  errorMessage: string = '';
  isLoadingVisible: boolean = false;
  pieChart: any = [];
  linesChart: any = [];
  reportsData!: GetReportsData;
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
        this.setupPieChart();
        this.setupLineChart();
        this.showLoadingComponent(false);
      }
    });
  }


  setupPieChart() {
    const dataForPie = {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };

    this.pieChart = new Chart('canvas-pie-chart', {
      type: 'doughnut',
      data: dataForPie
    });
  }

  setupLineChart() {
    const totalEntradas = this.reportsData.totalEntradaSaidaProdutos.filter(item => item.tipo == 1).length;
    const totalSaidas = this.reportsData.totalEntradaSaidaProdutos.filter(item => item.tipo == 0).length;

    const itemsEntrada = this.reportsData.totalEntradaSaidaProdutos
      .filter(item => item.tipo == 1)
      .map(item => item.total);

    const NUMBER_CFG_Entradas = {
      count: totalEntradas,
      min: 0,
      max: 100,
      from: itemsEntrada,
      decimals: 0,
      continuity: 0
    };

    const itemsSaida = this.reportsData.totalEntradaSaidaProdutos
      .filter(item => item.tipo == 0)
      .map(item => item.total);

    const NUMBER_CFG_Saidas = {
      count: totalSaidas,
      min: 0,
      max: 100,
      from: itemsSaida,
      decimals: 0,
      continuity: 0
    };

    const labels = Utils.months({count: 7, section: 0});
    const dataForLines = {
      labels: labels,
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
