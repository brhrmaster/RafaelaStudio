import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/models.component';

@Component({
  selector: 'app-produto-form',
  imports: [
    CommonModule,
  ],
  templateUrl: './produto-form.component.html',
  styles: ''
})
export class ProdutoFormComponent {

  produtoSelecionado!: Product;
  @Output() showLoading = new EventEmitter<boolean>();

  constructor(private productService: ProductService) {}

  private showLogin(show: boolean) {
    this.showLoading.emit(show);
  }

  cadastrar() {
    // fechando cortina (LOADING...)
    const apiResponse = this.productService.createNew(this.produtoSelecionado);

    // abrindo cortina (ABRIR MODAL)
    console.log('produto cadastrado!');
  }
}
