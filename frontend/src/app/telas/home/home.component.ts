import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import Utils from '../../componentes/utils';
import { NEVER } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [LoadingComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  isLoadingVisible: boolean = false;
  pieChart: any = [];
  linesChart: any = [];
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  ngOnInit() {
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

    const DATA_COUNT = 7;
    const NUMBER_CFG = {
      count: DATA_COUNT,
      min: -100,
      max: 100,
      from: [],
      decimals: 0,
      continuity: 0
    };

    const labels = Utils.months({count: 7, section: 0});
    const dataForLines = {
      labels: labels,
      datasets: [
        {
          label: 'Entradas',
          data: Utils.numbers(NUMBER_CFG),
          borderColor: Utils.CHART_COLORS.green,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.5),
        },
        {
          label: 'Saídas',
          data: Utils.numbers(NUMBER_CFG),
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        }
      ]
    };


    this.linesChart = new Chart('canvas-lines-chart', {
      type: 'line',
      data: dataForPie,
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
}
