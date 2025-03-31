import { Component, EventEmitter, Output } from '@angular/core';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [LoadingComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }
}
