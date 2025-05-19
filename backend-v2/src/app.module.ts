import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ProdutosModule } from './produtos/produtos.module';
import { FornecedoresService } from './fornecedores/fornecedores.service';
import { FornecedoresController } from './fornecedores/fornecedores.controller';
import { FornecedoresModule } from './fornecedores/fornecedores.module';
import { ProdutoFornecedorService } from './produto-fornecedor/produto-fornecedor.service';
import { ProdutoFornecedorController } from './produto-fornecedor/produto-fornecedor.controller';
import { ProdutoFornecedorModule } from './produto-fornecedor/produto-fornecedor.module';
import { FormatosModule } from './formatos/formatos.module';
import { ProdutoEstoqueModule } from './produto-estoque/produto-estoque.module';
import { ReportsModule } from './reports/reports.module';
import { CidadesService } from './cidades/cidades.service';
import { EstadosService } from './estados/estados.service';
import { CidadesModule } from './cidades/cidades.module';
import { EstadosModule } from './estados/estados.module';
import { UsuariosController } from './usuarios/usuarios.controller';
import { ProdutosController } from './produtos/produtos.controller';
import { CidadesController } from './cidades/cidades.controller';
import { EstadosController } from './estados/estados.controller';
import { ProdutoEstoqueController } from './produto-estoque/produto-estoque.controller';
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';
import { ProdutosService } from './produtos/produtos.service';
import { UsuariosService } from './usuarios/usuarios.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { FormatosService } from './formatos/formatos.service';
import { FormatosController } from './formatos/formatos.controller';
import { ProdutoEstoqueService } from './produto-estoque/produto-estoque.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Coloque true apenas se quiser auto-migrar entidades
    }),
    AuthModule,
    ProdutosModule,
    FornecedoresModule,
    ProdutoEstoqueModule,
    ProdutoFornecedorModule,
    FormatosModule,
    ReportsModule,
    CidadesModule,
    EstadosModule,
    UsuariosModule,
  ],
  providers: [
    AuthService,
    ProdutosService,
    FornecedoresService,
    ProdutoEstoqueService,
    ProdutoFornecedorService,
    FormatosService,
    ReportsService,
    CidadesService,
    EstadosService,
    UsuariosService,
  ],
  controllers: [
    AuthController,
    ProdutosController,
    FornecedoresController,
    ProdutoEstoqueController,
    ProdutoFornecedorController,
    FormatosController,
    ReportsController,
    CidadesController,
    EstadosController,
    UsuariosController,
  ],
})
export class AppModule {}
