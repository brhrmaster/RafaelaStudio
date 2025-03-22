import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fornecedor-form',
  imports: [
    CommonModule
  ],
  templateUrl: './fornecedor-form.component.html',
  styles: ''
})
export class FornecedorFormComponent {
  fornecedorSelecionado = {};
}
