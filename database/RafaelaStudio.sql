use RafaelaPi;

create table produto(
id_produto int not null auto_increment,
nome varchar(100),
data_validade date,
primary key (id_produto)
)

create table departamento_cliente(
id_departamento_cliente int not null auto_increment, 
quantidade int, 
id_produto_cliente int not null,
primary key (id_departamento_cliente),
foreign key (id_produto_cliente) references produto (id_produto)
)

create table departamento_fornecedor(
id_departamento_fornecedor int not null auto_increment, 
quantidade int, 
id_produto_fornecedor int not null,
primary key (id_departamento_fornecedor),
foreign key (id_produto_fornecedor) references produto (id_produto)
)

create table departamento_curso(
id_departamento_curso int not null auto_increment, 
quantidade int, 
id_produto_curso int not null,
primary key (id_departamento_curso),
foreign key (id_produto_curso) references produto (id_produto)
)

create table fornecido_por(
produto_fornecido_por int not null,
fornecedor_fornece int not null, 
foreign key(produto_fornecido_por) references produto(id_produto)
)

create table fornecedor(
id_fornecedor int not null auto_increment, 
nome varchar(100) default null,
endereço varchar(100) default null,
telefone varchar(100) default null,
primary key(id_fornecedor)
)

create table usuario(
id_usuario int(12) not null auto_increment,
nome varchar(100) default null,
senha varchar(10) default null,
primary key(id_usuario)
)

drop table departamento_fornecedor;

show tables from RafaelaPi;

describe produto;

describe departamento_cliente;