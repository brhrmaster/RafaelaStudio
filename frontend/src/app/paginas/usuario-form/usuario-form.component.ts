import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-form',
  imports: [
    CommonModule,
  ],
  templateUrl: './usuario-form.component.html',
  styles: ''
})
export class UsuarioFormComponent {
  usuarioSelecionado = {};
}
