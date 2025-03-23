import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../models/models.component';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user: User = {
    id: 0,
    name: 'x'
  };

  @Output() alterarPaginaAtual = new EventEmitter<string>();

  constructor() {
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser);
    if(currentUser) {
      this.user = JSON.parse(currentUser);
      this.alterarPaginaAtual.emit('HOME');
    }
  }

  login() {
    localStorage.setItem('currentUser', JSON.stringify(this.user));
    this.alterarPaginaAtual.emit('HOME');
  }
}
