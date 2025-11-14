-- Script de criação da Base de Dados
-- Gestão de Receitas - PIS 2025/2026

DROP DATABASE IF EXISTS gestao_receitas;
CREATE DATABASE gestao_receitas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestao_receitas;

-- Tabela de Utilizadores
CREATE TABLE utilizadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tipo ENUM('admin', 'user') DEFAULT 'user',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Tabela de Categorias
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de Dificuldades
CREATE TABLE dificuldades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nivel VARCHAR(20) UNIQUE NOT NULL,
    ordem INT NOT NULL
) ENGINE=InnoDB;

-- Tabela de Receitas
CREATE TABLE receitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    descricao_preparacao TEXT NOT NULL,
    tempo_preparacao INT NOT NULL COMMENT 'Tempo em minutos',
    custo DECIMAL(10, 2) NOT NULL,
    porcoes INT DEFAULT 1,
    imagem VARCHAR(255),
    categoria_id INT NOT NULL,
    dificuldade_id INT NOT NULL,
    utilizador_id INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (dificuldade_id) REFERENCES dificuldades(id) ON DELETE RESTRICT,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    INDEX idx_categoria (categoria_id),
    INDEX idx_dificuldade (dificuldade_id),
    INDEX idx_nome (nome)
) ENGINE=InnoDB;

-- Tabela de Ingredientes
CREATE TABLE ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de Relacionamento Receita-Ingrediente
CREATE TABLE receita_ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receita_id INT NOT NULL,
    ingrediente_id INT NOT NULL,
    quantidade VARCHAR(50) NOT NULL COMMENT 'Ex: 200g, 2 unidades, 1 chávena',
    FOREIGN KEY (receita_id) REFERENCES receitas(id) ON DELETE CASCADE,
    FOREIGN KEY (ingrediente_id) REFERENCES ingredientes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_receita_ingrediente (receita_id, ingrediente_id)
) ENGINE=InnoDB;

-- Tabela de Avaliações
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receita_id INT NOT NULL,
    utilizador_id INT NOT NULL,
    classificacao INT NOT NULL CHECK (classificacao BETWEEN 1 AND 5),
    comentario TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receita_id) REFERENCES receitas(id) ON DELETE CASCADE,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_rating (receita_id, utilizador_id)
) ENGINE=InnoDB;

-- Inserir dados iniciais
-- Dificuldades
INSERT INTO dificuldades (nivel, ordem) VALUES
('Facil', 1),
('Medio', 2),
('Dificil', 3);

-- Categorias
INSERT INTO categorias (nome, descricao) VALUES
('Entradas', 'Pratos para começar a refeição'),
('Sopas', 'Sopas e caldos'),
('Pratos Principais', 'Prato principal da refeição'),
('Sobremesas', 'Doces e sobremesas'),
('Bebidas', 'Bebidas e sumos'),
('Snacks', 'Lanches e petiscos'),
('Vegetariano', 'Pratos vegetarianos'),
('Vegano', 'Pratos veganos');

-- Utilizador admin padrão (password: admin123)
INSERT INTO utilizadores (nome, email, password_hash, tipo) VALUES
('Administrador', 'admin@receitas.pt', '$2a$10$AFlKtM7NeobYrcTnTKKpRei1CpfVsTgrqWKHBJbEAHTp18D4ixLUy', 'admin'),
('João Silva', 'joao@exemplo.pt', '$2a$10$Jf84fiQxImXFM.iTn413s.eSmW99MiIpYsx5Tw/fOHJX9KEVowDXq', 'user');

-- Ingredientes comuns
INSERT INTO ingredientes (nome) VALUES
('Sal'),
('Pimenta'),
('Azeite'),
('Alho'),
('Cebola'),
('Tomate'),
('Batata'),
('Arroz'),
('Massa'),
('Queijo'),
('Ovos'),
('Leite'),
('Farinha'),
('Açúcar'),
('Manteiga'),
('Frango'),
('Carne de Vaca'),
('Peixe'),
('Camarão'),
('Cenoura'),
('Courgette'),
('Brócolos'),
('Chocolate'),
('Natas'),
('Vinho Branco');

-- Receita exemplo
INSERT INTO receitas (nome, autor, descricao_preparacao, tempo_preparacao, custo, porcoes, categoria_id, dificuldade_id, utilizador_id)
VALUES (
    'Arroz de Tomate',
    'Maria Santos',
    '1. Refogue a cebola e o alho no azeite\n2. Adicione o tomate cortado\n3. Junte o arroz e refogue\n4. Adicione água quente (o dobro do arroz)\n5. Deixe cozinhar em lume brando por 15-20 minutos\n6. Tempere com sal e pimenta a gosto',
    30,
    5.50,
    4,
    3,
    1,
    2
);

-- Ingredientes da receita exemplo
INSERT INTO receita_ingredientes (receita_id, ingrediente_id, quantidade) VALUES
(1, 3, '3 colheres de sopa'),
(1, 4, '2 dentes'),
(1, 5, '1 unidade'),
(1, 6, '4 unidades'),
(1, 8, '2 chavenas'),
(1, 1, 'q.b.'),
(1, 2, 'q.b.');

-- Mais receitas de exemplo
INSERT INTO receitas (nome, autor, descricao_preparacao, tempo_preparacao, custo, porcoes, categoria_id, dificuldade_id, utilizador_id)
VALUES
(
    'Frango Assado com Batatas',
    'Carlos Mendes',
    '1. Tempere o frango com sal, pimenta, alho e azeite\n2. Deixe marinar por 30 minutos\n3. Corte as batatas em gomos\n4. Tempere as batatas com sal, azeite e alecrim\n5. Coloque o frango e as batatas no tabuleiro\n6. Leve ao forno a 180°C por 60 minutos\n7. Vire as batatas a meio da cozedura\n8. Sirva quente',
    90,
    12.50,
    4,
    3,
    2,
    1
),
(
    'Mousse de Chocolate',
    'Ana Rodrigues',
    '1. Derreta o chocolate em banho-maria\n2. Separe as gemas das claras\n3. Misture as gemas ao chocolate derretido\n4. Bata as claras em castelo firme\n5. Adicione o açúcar às claras gradualmente\n6. Incorpore delicadamente as claras ao chocolate\n7. Distribua por taças\n8. Leve ao frigorífico por 3 horas\n9. Sirva bem fresco',
    20,
    6.00,
    6,
    4,
    1,
    2
),
(
    'Sopa de Legumes',
    'Teresa Costa',
    '1. Descasque e corte todos os legumes em cubos\n2. Refogue a cebola e o alho no azeite\n3. Adicione os legumes e refogue por 5 minutos\n4. Cubra com água (cerca de 1,5L)\n5. Adicione sal a gosto\n6. Deixe cozinhar por 30 minutos\n7. Triture com a varinha mágica\n8. Sirva quente com um fio de azeite',
    45,
    4.00,
    4,
    2,
    1,
    2
);

-- Ingredientes do Frango Assado (receita_id = 2)
INSERT INTO receita_ingredientes (receita_id, ingrediente_id, quantidade) VALUES
(2, 16, '1 frango inteiro (1,5kg)'),
(2, 7, '6 unidades médias'),
(2, 4, '4 dentes'),
(2, 3, '4 colheres de sopa'),
(2, 1, 'q.b.'),
(2, 2, 'q.b.');

-- Ingredientes da Mousse de Chocolate (receita_id = 3)
INSERT INTO receita_ingredientes (receita_id, ingrediente_id, quantidade) VALUES
(3, 23, '200g chocolate negro'),
(3, 11, '4 unidades'),
(3, 14, '100g'),
(3, 24, '200ml');

-- Ingredientes da Sopa de Legumes (receita_id = 4)
INSERT INTO receita_ingredientes (receita_id, ingrediente_id, quantidade) VALUES
(4, 7, '2 unidades médias'),
(4, 20, '2 unidades'),
(4, 21, '1 unidade'),
(4, 5, '1 unidade'),
(4, 4, '2 dentes'),
(4, 3, '2 colheres de sopa'),
(4, 1, 'q.b.');

-- Avaliações de exemplo
INSERT INTO avaliacoes (receita_id, utilizador_id, classificacao, comentario) VALUES
(1, 2, 5, 'Receita simples e deliciosa!'),
(2, 2, 4, 'Muito bom, mas precisa de mais tempero'),
(3, 1, 5, 'Sobremesa perfeita!');
