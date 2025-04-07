import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../componentes/loading/loading.component";
import { Fornecedor } from '../../models/models.component';
import { FornecedorService } from '../../services/fornecedor.service';

@Component({
  selector: 'app-fornecedor-form',
  imports: [
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './fornecedor-form.component.html',
  styleUrls: [
    '../../styles/tela-form.css',
    './fornecedor-form.component.css'
  ]
})
export class FornecedorFormComponent {
  errorMessage: string = '';
  fornecedorSelecionado!: Fornecedor;
  isLoadingVisible: boolean = false;
  @Output() alterarPaginaAtual = new EventEmitter<string>();
  fornecedorService: FornecedorService = inject(FornecedorService);

  constructor() {
  }

  private showLoadingComponent(show: boolean) {
    this.isLoadingVisible = show;
  }

  cadastrar() {

    // abrindo cortina (ABRIR MODAL)
    console.log('fornecedor cadastrado!');
  }
}
