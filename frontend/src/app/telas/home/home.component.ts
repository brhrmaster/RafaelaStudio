import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  @Output() alterarPaginaAtual = new EventEmitter<string>();
  @Output() showLoading = new EventEmitter<boolean>();
}
