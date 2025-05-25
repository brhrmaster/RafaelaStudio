import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPaginaComponent } from './componentes/header-pagina/header-pagina.component';
import { MenuLateralComponent } from "./componentes/menu-lateral/menu-lateral.component";
import { HomeComponent } from "./telas/home/home.component";
import { ProdutoListaComponent } from "./telas/produto-lista/produto-lista.component";
import { ProdutoFormComponent } from "./telas/produto-form/produto-form.component";
import { FornecedorListaComponent } from "./telas/fornecedor-lista/fornecedor-lista.component";
import { FornecedorFormComponent } from "./telas/fornecedor-form/fornecedor-form.component";
import { UsuarioListaComponent } from "./telas/usuario-lista/usuario-lista.component";
import { UsuarioFormComponent } from "./telas/usuario-form/usuario-form.component";
import { LoginComponent } from "./telas/login/login.component";
import { NavegacaoApp, Usuario } from './models/models.component';
import { EntradaSaidaListaComponent } from './telas/entradas-saidas-lista/entradas-saidas-lista.component';
import { EntradaSaidaFormComponent } from "./telas/entrada-saida-form/entrada-saida-form.component";
import { FormatoListaComponent } from './telas/formato-lista/formato-lista.component';
import { FormatoFormComponent } from './telas/formato-form/formato-form.component';

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
    FormatoListaComponent,
    FornecedorListaComponent,
    UsuarioListaComponent,
    EntradaSaidaListaComponent,
    ProdutoFormComponent,
    FormatoFormComponent,
    FornecedorFormComponent,
    UsuarioFormComponent,
    LoginComponent,
    EntradaSaidaFormComponent
],
  templateUrl: './app.component.html',
  styles: ''
})
export class AppComponent {
  titulos: IPagina = {
    'HOME': 'Painel - Relatório',
    'PRODUTO-LISTA': 'Lista de Produtos',
    'PRODUTO-FORM': 'Cadastro de Produto',
    'FORMATO-LISTA': 'Lista de Formatos',
    'FORMATO-FORM': 'Cadastro de Formato',
    'FORNECEDOR-LISTA': 'Lista de Fornecedores',
    'FORNECEDOR-FORM': 'Cadastro de Fornecedor',
    'USUARIO-LISTA': 'Lista de Usuários',
    'USUARIO-FORM': 'Cadastro de Usuário',
    'LOGIN': 'Acesso Restrito',
    'ENTRADA_SAIDA': 'Histórico de Entradas e Saídas',
    'ENTRADA_SAIDA-FORM': 'Registro de Entradas ou Saídas de Estoque'
  };

  paginaAtual: string = 'LOGIN';
  itemIdAtual: number = 0;
  itemModo?: number = 0;
  titulo: string = this.titulos[this.paginaAtual];
  usuarioLogado!: Usuario;

  constructor() {
    this.checkLoggedUser();
  }

  alterarPaginaAtual(navegacaoApp: NavegacaoApp) {
    this.paginaAtual = navegacaoApp.nomePagina;
    this.titulo = this.titulos[navegacaoApp.nomePagina];
    this.itemIdAtual = navegacaoApp.itemId;
    this.itemModo = navegacaoApp.itemModo;
  }

  checkLoggedUser() {
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser) {
      this.usuarioLogado = JSON.parse(currentUser);
      this.paginaAtual = 'HOME';
      this.titulo = this.titulos[this.paginaAtual];
    }
  }
}
