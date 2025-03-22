import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPaginaComponent } from './componentes/header-pagina/header-pagina.component';
import { MenuLateralComponent } from "./componentes/menu-lateral/menu-lateral.component";
import { HomeComponent } from "./paginas/home/home.component";
import { ProdutoListaComponent } from "./paginas/produto-lista/produto-lista.component";
import { ProdutoFormComponent } from "./paginas/produto-form/produto-form.component";
import { FornecedorListaComponent } from "./paginas/fornecedor-lista/fornecedor-lista.component";
import { FornecedorFormComponent } from "./paginas/fornecedor-form/fornecedor-form.component";
import { UsuarioListaComponent } from "./paginas/usuario-lista/produto-lista.component";
import { UsuarioFormComponent } from "./paginas/usuario-form/usuario-form.component";

interface IPagina {
  [key: string]: string;
};

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HeaderPaginaComponent,
    MenuLateralComponent,
    HomeComponent,
    ProdutoListaComponent,
    ProdutoFormComponent,
    FornecedorListaComponent,
    FornecedorFormComponent,
    UsuarioListaComponent,
    UsuarioFormComponent
],
  templateUrl: './app.component.html',
  styles: ''
})
export class AppComponent {
  titulos: IPagina = {
    'HOME': 'Painel de Controle',
    'PRODUTO-LISTA': 'Lista de Produtos',
    'PRODUTO-FORM': 'Cadastro de Produtos',
    'FORNECEDOR-LISTA': 'Lista de Fornecedores',
    'FORNECEDOR-FORM': 'Cadastro de Fornecedores',
    'USUARIO-LISTA': 'Lista de Usuários',
    'USUARIO-FORM': 'Cadastro de Usuários'
  };

  paginaAtual: string = 'HOME';
  titulo: string = this.titulos[this.paginaAtual];

  alterarPaginaAtual(pagina: string) {
    this.paginaAtual = pagina;
    this.titulo = this.titulos[pagina];
  }
}
