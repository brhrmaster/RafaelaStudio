<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Perfis de Usuarios

Faça o mesmo para os outros endpoints/entidades conforme as regras:

* **Gerente/admin:** acesso total
* **Controlador:** pode criar e atualizar, mas não remover entidades nem gerenciar usuários
* **Visitante:** somente leitura

---

### **Resumo prático por perfil**

| Entidade          | Gerente/Admin |    Controlador   | Visitante |
| ----------------- | :-----------: | :--------------: | :-------: |
| Usuários          |      CRUD     |  Somente leitura |   Nenhum  |
| Produtos          |      CRUD     | CRU (sem DELETE) |     R     |
| Fornecedores      |      CRUD     |        CRU       |     R     |
| Formatos          |      CRUD     |        CRU       |     R     |
| ProdutoFornecedor |      CRUD     |        CRU       |     R     |
| ProdutoEstoque    |      CRUD     |        CRU       |     R     |

**CRUD = Criar, Ler, Atualizar, Deletar**
**CRU = Criar, Ler, Atualizar**
**R = Ler**

## Endpoints

### Produtos

#### **POST** `/produtos`

Cria um produto.

```json
{
  "nome": "Camiseta Branca",
  "descricao": "Camiseta básica de algodão",
  "preco": 29.90,
  "formatoId": 2
}
```
---
#### **GET** `/produtos`

Lista todos os produtos.
---
#### **GET** `/produtos/:id`

Busca um produto pelo ID.
---
#### **PATCH** `/produtos/:id`

Atualiza um produto.

```json
{
  "nome": "Camiseta Preta",
  "preco": 35.00,
  "formatoId": 3
}
```
---
#### **DELETE** `/produtos/:id`

Remove um produto.

---

### Fornecedores

#### **POST** `/fornecedores`

Cria um fornecedor.

```json
{
  "empresa": "Acme LTDA",
  "nome_representante": "João Silva",
  "telefone": "(11) 90000-0000",
  "email": "joao@acme.com",
  "endereco": "Rua das Flores",
  "numero": "123",
  "cidadeId": 1,
  "cep": "01234-567",
  "site": "www.acme.com",
  "produtosFornecedores": [
    { "id": 1 },
    { "id": 3 },
  ]
}
```
---
#### **GET** `/fornecedores`

Lista todos os fornecedores.
---
#### **GET** `/fornecedores/:id`

Busca um fornecedor pelo ID.
---
#### **PATCH** `/fornecedores/:id`

Atualiza um fornecedor.

```json
{
  "nome": "Fornecedor Y",
  "ativo": false
}
```
---
#### **DELETE** `/fornecedores/:id`

Remove um fornecedor.

---

### Formatos

#### **POST** `/formatos`

Cria um formato.

```json
{
  "nome": "Caixa",
  "descricao": "Caixa de papelão padrão"
}
```
---
#### **GET** `/formatos`

Lista todos os formatos.
---
#### **GET** `/formatos/:id`

Busca um formato pelo ID.
---
#### **PATCH** `/formatos/:id`

Atualiza um formato.

```json
{
  "descricao": "Caixa reforçada para envio"
}
```
---
#### **DELETE** `/formatos/:id`

Remove um formato.

---

### Produto-Fornecedor

#### **POST** `/produto-fornecedor`

Associa fornecedor a produto.

```json
{
  "produtoId": 1,
  "fornecedorId": 3,
  "ativo": true
}
```
---
#### **GET** `/produto-fornecedor`

Lista todas as associações produto-fornecedor.
---
#### **DELETE** `/produto-fornecedor/:id`

Remove uma associação.
---
#### **GET** `/produto-fornecedor/produto/:produtoId`

Lista fornecedores de um produto.
---
#### **GET** `/produto-fornecedor/fornecedor/:fornecedorId`

Lista produtos de um fornecedor.

---

### Autenticação

#### **POST** `/auth/login`

Gera token JWT.

```json
{
  "login": "usuario",
  "password": "senha"
}
```

**Resposta:**

```json
{
  "access_token": "jwt_token"
}
```
---
#### **POST** `/usuarios`

Cria novo usuário.

```json
{
  "login": "usuario",
  "password": "senha"
}
```
---
#### **GET** `/usuarios`

Lista todos usuários (**protegido por JWT**).

Com certeza! Aqui estão os endpoints do **controle de produto-estoque** já formatados em Markdown, seguindo o padrão dos anteriores:

---

### Produto-Estoque

#### **POST** `/produto-estoque`

Cria uma movimentação de estoque (entrada ou saída) para um produto.

```json
{
  "tipo": 1,                // 1=entrada, 0=saida
  "produtoId": 5,
  "total": 100,
  "validade": "2024-12-31",
  "qtd_clientes": 10,
  "qtd_cursos": 5
}
```

---

#### **GET** `/produto-estoque`

Lista todas as movimentações de estoque cadastradas.

---

#### **GET** `/produto-estoque/:id`

Busca uma movimentação de estoque específica pelo ID.

---

#### **PATCH** `/produto-estoque/:id`

Atualiza uma movimentação de estoque existente.

```json
{
  "total": 150,
  "validade": "2025-01-15"
}
```

---

#### **DELETE** `/produto-estoque/:id`

Remove uma movimentação de estoque pelo ID.

---

#### **GET** `/produto-estoque/produto/:produtoId`

Lista todas as movimentações de estoque relacionadas a um produto específico.

---

### Cidades e Estados

#### GET /estados
Lista todos os estados, ordenados por nome ASC.

#### GET /cidades/:estadoId
Lista todas as cidades do estado informado, ordenadas por nome ASC.


---

### Relatorios

#### **GET** `/reports`

Retorna um objeto JSON com os seguintes campos:

- totalFornecedoresRecentementeCriados

  - Descrição: Total de fornecedores cadastrados no último mês

- totalProdutosRecentementeCriados

  - Descrição: Total de produtos cadastrados no último mês

- totalProdutosPorFornecedor

  - Descrição: Lista de fornecedores e o total de produtos relacionados a cada um

- totalEntradaSaidaProdutos

  - Descrição: Entradas e saídas de estoque por dia no último mês (tipo = 1 entrada, 0 saída)

- produtosEmVencimento

  - Descrição: Produtos com estoque do tipo ENTRADA (1) e validade em até 45 dias a partir de hoje

```json
{
  "totalFornecedoresRecentementeCriados": 4,
  "totalProdutosRecentementeCriados": 7,
  "totalProdutosPorFornecedor": [
    {
      "empresa": "Fornecedor X",
      "totalProdutos": 2
    },
    {
      "empresa": "Fornecedor Y",
      "totalProdutos": 1
    }
  ],
  "totalEntradaSaidaProdutos": [
    {
      "dayOfMonth": "2024-05-01",
      "tipo": 1,
      "total": 200
    },
    {
      "dayOfMonth": "2024-05-01",
      "tipo": 0,
      "total": 50
    }
  ],
  "produtosEmVencimento": [
    {
      "id": 1,
      "nome": "Produto A",
      "validade": "2024-06-15",
      "total": 30,
      "dias_restantes": 10
    },
    {
      "id": 1,
      "nome": "Produto A",
      "validade": "2024-04-15",
      "total": 2,
      "dias_restantes": -3
    }
  ]
}
```



---



**Observação:**
Todos os endpoints são protegidos por JWT (necessário enviar o token de autenticação).

Se quiser endpoints adicionais (ex: saldo atual, relatório de estoque, filtro por período), só pedir!


## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
