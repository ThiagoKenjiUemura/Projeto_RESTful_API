CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255)
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255)
);

CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    descricao TEXT,
    valor NUMERIC(10, 2),
    data DATE,
    categoria_id INT,
    usuario_id INT,
    tipo VARCHAR(255)
);

INSERT INTO categorias (descricao) VALUES
    ('Alimentação'),
    ('Assinaturas e Serviços'),
    ('Casa'),
    ('Mercado'),
    ('Cuidados Pessoais'),
    ('Educação'),
    ('Família'),
    ('Lazer'),
    ('Pets'),
    ('Presentes'),
    ('Roupas'),
    ('Saúde'),
    ('Transporte'),
    ('Salário'),
    ('Vendas'),
    ('Outras receitas'),
    ('Outras despesas');
