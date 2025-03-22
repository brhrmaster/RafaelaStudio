SET sql_notes = 0;

CREATE DATABASE IF NOT EXISTS RAFAELA_STUDIO_DB;

use RAFAELA_STUDIO_DB;

CREATE TABLE IF NOT EXISTS tbl_produtos(
    id int not null auto_increment,
    nome varchar(100),
    data_validade date,
    created_at date,
    updated_at date,
    primary key (id)
);

CREATE TABLE IF NOT EXISTS tbl_departamentos (
    id int not null auto_increment, 
    nome varchar(100),
    tipo int not null, -- Pode ser 0 (Cliente) | 1 (Fornecedor) | 2 (Curso)
    primary key (id)
);

CREATE TABLE IF NOT EXISTS tbl_fornecedores (
    id int not null auto_increment, 
    nome varchar(100) default null,
    endereco varchar(100) default null,
    telefone varchar(100) default null,
    created_at date,
    updated_at date,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS tbl_usuarios (
    id int(12) not null auto_increment,
    nome varchar(100) default null,
    senha varchar(10) default null,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS tbl_departamento_cliente (
    id int not null auto_increment, 
    quantidade int, 
    cliente_id int not null,
    departamento_id int not null,
    primary key (id),
    foreign key (cliente_id) references tbl_produtos (id),
    foreign key (departamento_id) references tbl_departamentos (id)
);

CREATE TABLE IF NOT EXISTS tbl_departamento_fornecedor (
    id int not null auto_increment, 
    quantidade int, 
    fornecedor_id int not null,
    departamento_id int not null,
    primary key (id),
    foreign key (fornecedor_id) references tbl_fornecedores (id),
    foreign key (departamento_id) references tbl_departamentos (id)
);

CREATE TABLE IF NOT EXISTS tbl_produto_fornecedor(
    id int not null auto_increment, 
    produto_id int not null,
    fornecedor_id int not null,
    primary key (id),
    foreign key(produto_id) references tbl_produtos (id),
    foreign key(fornecedor_id) references tbl_fornecedores (id)
);

SET sql_notes = 1;