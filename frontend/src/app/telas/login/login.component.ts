import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  @Output() alterarPaginaAtual = new EventEmitter<string>();

  login() {
    this.alterarPaginaAtual.emit('HOME');
  }
}
